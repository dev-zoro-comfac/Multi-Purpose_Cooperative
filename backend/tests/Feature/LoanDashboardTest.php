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

function dashboardUser(RoleEnum $role): User
{
    return User::factory()->create()->assignRole($role->value);
}

function dashboardLoan(string $status, int $amountRequested, int $netProceeds): LoanApplication
{
    $memberUser = dashboardUser(RoleEnum::Member);
    $memberUser->update([
        'email' => fake()->unique()->safeEmail(),
    ]);

    $member = Member::create([
        'user_id' => $memberUser->id,
        'member_no' => 'MEM-'.fake()->unique()->numerify('######'),
        'first_name' => 'Dashboard',
        'last_name' => 'Member',
        'email' => $memberUser->email,
        'status' => 'active',
    ]);

    return LoanApplication::create([
        'application_no' => 'LOAN-'.fake()->unique()->numerify('######'),
        'member_id' => $member->id,
        'borrower_name' => 'Dashboard Borrower',
        'borrower_email' => $memberUser->email,
        'amount_requested' => $amountRequested,
        'net_proceeds' => $netProceeds,
        'status' => $status,
    ]);
}

it('returns dashboard stats for accounting users', function () {
    $accounting = dashboardUser(RoleEnum::Accounting);

    dashboardLoan('submitted_for_evaluation', 10000, 9500);
    dashboardLoan('approved', 20000, 19000);
    dashboardLoan('released', 30000, 29000);
    dashboardLoan('rejected', 40000, 39000);

    actingAs($accounting)
        ->getJson('/api/v1/loan-applications-dashboard')
        ->assertOk()
        ->assertJsonPath('data.total_loans', 4)
        ->assertJsonPath('data.pending_loans', 1)
        ->assertJsonPath('data.submitted_for_evaluation', 1)
        ->assertJsonPath('data.approved_loans', 1)
        ->assertJsonPath('data.released_loans', 1)
        ->assertJsonPath('data.rejected_loans', 1)
        ->assertJsonPath('data.total_amount_requested', 100000)
        ->assertJsonPath('data.total_amount_approved', 50000)
        ->assertJsonPath('data.total_net_proceeds', 48000);
});

it('blocks members from dashboard stats', function () {
    $member = dashboardUser(RoleEnum::Member);

    actingAs($member)
        ->getJson('/api/v1/loan-applications-dashboard')
        ->assertStatus(403);
});
