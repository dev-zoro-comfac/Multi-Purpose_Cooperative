<?php

use App\Enums\RoleEnum;
use App\Models\LoanApplication;
use App\Models\Member;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

function workflowUser(RoleEnum $role): User
{
    return User::factory()->create()->assignRole($role->value);
}

function workflowMemberUser(string $email = 'member-workflow@example.com'): array
{
    $user = workflowUser(RoleEnum::Member);

    $user->update([
        'email' => $email,
    ]);

    $member = Member::create([
        'user_id' => $user->id,
        'member_no' => 'MEM-'.fake()->unique()->numerify('######'),
        'first_name' => 'Workflow',
        'last_name' => 'Member',
        'email' => $email,
        'status' => 'active',
    ]);

    return [$user, $member];
}

function workflowLoan(string $status = 'submitted_for_evaluation'): LoanApplication
{
    [$user, $member] = workflowMemberUser(fake()->unique()->safeEmail());

    return LoanApplication::create([
        'application_no' => 'LOAN-'.fake()->unique()->numerify('######'),
        'member_id' => $member->id,
        'borrower_name' => 'Workflow Borrower',
        'borrower_email' => $user->email,
        'amount_requested' => 25000,
        'status' => $status,
    ]);
}

it('allows accounting to approve a submitted loan', function () {
    $accounting = workflowUser(RoleEnum::Accounting);
    $loan = workflowLoan();

    actingAs($accounting)
        ->patchJson("/api/v1/loan-applications/{$loan->id}/approve")
        ->assertOk()
        ->assertJson([
            'success' => true,
        ]);

    $loan->refresh();

    expect($loan->status)->toBe('approved');
    expect($loan->approved_by)->toBe($accounting->id);
    expect($loan->approved_at)->not->toBeNull();
    expect($loan->activityLogs()->where('action', 'approved')->count())->toBe(1);
});

it('allows accounting to reject a submitted loan with notes', function () {
    $accounting = workflowUser(RoleEnum::Accounting);
    $loan = workflowLoan();

    actingAs($accounting)
        ->patchJson("/api/v1/loan-applications/{$loan->id}/reject", [
            'accounting_notes' => 'Insufficient supporting details.',
        ])
        ->assertOk()
        ->assertJson([
            'success' => true,
        ]);

    $loan->refresh();

    expect($loan->status)->toBe('rejected');
    expect($loan->accounting_notes)->toBe('Insufficient supporting details.');
    expect($loan->rejected_at)->not->toBeNull();
    expect($loan->activityLogs()->where('action', 'rejected')->count())->toBe(1);
});

it('allows accounting to release an approved loan', function () {
    $accounting = workflowUser(RoleEnum::Accounting);
    $loan = workflowLoan('approved');

    actingAs($accounting)
        ->patchJson("/api/v1/loan-applications/{$loan->id}/release")
        ->assertOk()
        ->assertJson([
            'success' => true,
        ]);

    $loan->refresh();

    expect($loan->status)->toBe('released');
    expect($loan->released_at)->not->toBeNull();
    expect($loan->activityLogs()->where('action', 'released')->count())->toBe(1);
});

it('blocks members from accounting workflow actions', function (string $action) {
    [$memberUser] = workflowMemberUser('workflow-action-member@example.com');
    $loan = workflowLoan($action === 'release' ? 'approved' : 'submitted_for_evaluation');

    actingAs($memberUser)
        ->patchJson("/api/v1/loan-applications/{$loan->id}/{$action}")
        ->assertStatus(403);
})->with([
    'approve',
    'reject',
    'release',
]);

it('rejects invalid release transition when loan is not approved', function () {
    $accounting = workflowUser(RoleEnum::Accounting);
    $loan = workflowLoan('submitted_for_evaluation');

    actingAs($accounting)
        ->patchJson("/api/v1/loan-applications/{$loan->id}/release")
        ->assertStatus(422)
        ->assertJson([
            'success' => false,
        ]);

    expect($loan->fresh()->status)->toBe('submitted_for_evaluation');
});

it('rejects approving an already released loan', function () {
    $accounting = workflowUser(RoleEnum::Accounting);
    $loan = workflowLoan('released');

    actingAs($accounting)
        ->patchJson("/api/v1/loan-applications/{$loan->id}/approve")
        ->assertStatus(422)
        ->assertJson([
            'success' => false,
        ]);

    expect($loan->fresh()->status)->toBe('released');
});
