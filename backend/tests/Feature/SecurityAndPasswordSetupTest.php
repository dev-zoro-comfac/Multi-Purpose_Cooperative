<?php

use App\Enums\RoleEnum;
use App\Models\LoanApplication;
use App\Models\Member;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;

use function Pest\Laravel\actingAs;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

function createMemberUser(string $email): array
{
    $user = User::factory()->create([
        'email' => $email,
    ])->assignRole(RoleEnum::Member->value);

    $member = Member::create([
        'user_id' => $user->id,
        'member_no' => 'MEM-'.fake()->unique()->numerify('######'),
        'first_name' => fake()->firstName(),
        'last_name' => fake()->lastName(),
        'email' => $email,
        'status' => 'active',
    ]);

    return [$user, $member];
}

function createLoanForMember(Member $member, string $borrowerEmail, string $borrowerName = 'Test Borrower'): LoanApplication
{
    return LoanApplication::create([
        'application_no' => 'LOAN-'.fake()->unique()->numerify('######'),
        'member_id' => $member->id,
        'borrower_name' => $borrowerName,
        'borrower_email' => $borrowerEmail,
        'amount_requested' => 10000,
        'status' => 'submitted_for_evaluation',
    ]);
}

it('blocks guests from member and loan APIs', function () {
    $this->getJson('/api/v1/members')->assertStatus(401);
    $this->getJson('/api/v1/loan-applications')->assertStatus(401);
});

it('allows accounting to send a password setup link for a member account', function () {
    Notification::fake();

    $accounting = User::factory()->create()->assignRole(RoleEnum::Accounting->value);
    [$memberUser, $member] = createMemberUser('borrower@example.com');

    actingAs($accounting)
        ->postJson("/api/v1/members/{$member->id}/send-password-setup")
        ->assertOk()
        ->assertJson([
            'success' => true,
        ]);

    Notification::assertSentTo($memberUser, ResetPassword::class);
});

it('sends a password setup link when accounting creates a member login account', function () {
    Notification::fake();

    $accounting = User::factory()->create()->assignRole(RoleEnum::Accounting->value);

    actingAs($accounting)
        ->postJson('/api/v1/members', [
            'member_no' => 'MEM-SETUP-001',
            'first_name' => 'Setup',
            'last_name' => 'Member',
            'email' => 'setup-member@example.com',
            'create_account' => true,
            'status' => 'active',
        ])
        ->assertCreated();

    $memberUser = User::where('email', 'setup-member@example.com')->firstOrFail();
    $member = Member::where('email', 'setup-member@example.com')->firstOrFail();

    expect($member->user_id)->toBe($memberUser->id);
    Notification::assertSentTo($memberUser, ResetPassword::class);
});

it('auto-creates borrower member account and setup link when accounting creates a loan', function () {
    Notification::fake();

    $accounting = User::factory()->create()->assignRole(RoleEnum::Accounting->value);

    actingAs($accounting)
        ->postJson('/api/v1/loan-applications', [
            'borrower_name' => 'Loan Setup Member',
            'borrower_email' => 'loan-setup@example.com',
            'borrower_contact_number' => '09123456789',
            'amount_requested' => 15000,
        ])
        ->assertCreated()
        ->assertJson([
            'success' => true,
        ]);

    $memberUser = User::where('email', 'loan-setup@example.com')->firstOrFail();
    $member = Member::where('email', 'loan-setup@example.com')->firstOrFail();

    expect($member->user_id)->toBe($memberUser->id);
    expect(LoanApplication::where('member_id', $member->id)->exists())->toBeTrue();
    Notification::assertSentTo($memberUser, ResetPassword::class);
});

it('blocks members from sending password setup links', function () {
    Notification::fake();

    [$requester] = createMemberUser('requester@example.com');
    [$targetUser, $targetMember] = createMemberUser('target@example.com');

    actingAs($requester)
        ->postJson("/api/v1/members/{$targetMember->id}/send-password-setup")
        ->assertStatus(403);

    Notification::assertNotSentTo($targetUser, ResetPassword::class);
});

it('only returns a member user own loan applications', function () {
    [$memberUser, $member] = createMemberUser('member@example.com');
    [$otherUser, $otherMember] = createMemberUser('other@example.com');

    $ownLoan = createLoanForMember($member, $memberUser->email, 'Own Borrower');
    $otherLoan = createLoanForMember($otherMember, $otherUser->email, 'Other Borrower');

    actingAs($memberUser)
        ->getJson('/api/v1/loan-applications')
        ->assertOk()
        ->assertJsonFragment([
            'id' => $ownLoan->id,
        ])
        ->assertJsonMissing([
            'id' => $otherLoan->id,
        ]);
});

it('resets a password with a valid token', function () {
    $user = User::factory()->create([
        'email' => 'reset@example.com',
    ]);

    $token = Password::createToken($user);

    $this->postJson('/api/v1/auth/spa/reset-password', [
        'token' => $token,
        'email' => $user->email,
        'password' => 'Member@123',
        'password_confirmation' => 'Member@123',
    ])
        ->assertOk()
        ->assertJson([
            'success' => true,
        ]);

    expect(Hash::check('Member@123', $user->fresh()->password))->toBeTrue();
});
