<?php

namespace Tests\Feature;

use App\Enums\RoleEnum;
use App\Models\Profile;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

use function Pest\Laravel\actingAs;

// php artisan test tests/Feature/UserTest.php

uses(RefreshDatabase::class);

const USER_ENDPOINT = '/api/v1/users';

it('returns 401 when guest tries to access /users', function () {
    $response = $this->getJson(USER_ENDPOINT);

    $response->assertStatus(401);
});

test('can access list of users based on role', function ($role, $expectedStatus) {
    $this->seed(RolesAndPermissionsSeeder::class);

    $requester = User::factory()->create()->assignRole($role);

    actingAs($requester)
        ->get(USER_ENDPOINT)
        ->assertStatus($expectedStatus);
})->with([
    [RoleEnum::Admin, 200],
    [RoleEnum::Accounting, 200],
    [RoleEnum::Member, 403],
    [RoleEnum::NonMember, 403],
]);

test('can create a user based on role', function ($role, $expectedStatus) {
    $this->seed(RolesAndPermissionsSeeder::class);

    $requester = User::factory()->create()->assignRole($role);
    $data = [
        'email' => 'john.doe@example.com',
        'password' => 'Test@123',
        'password_confirmation' => 'Test@123',
        'roles' => [RoleEnum::NonMember->value],

        'first_name' => 'John',
        'middle_name' => 'Robert',
        'last_name' => 'Doe',
        'contact_number' => '09123456789',
    ];

    actingAs($requester)
        ->post(
            USER_ENDPOINT,
            $data
        )
        ->assertStatus($expectedStatus);
})->with([
    [RoleEnum::Admin, 201],
    [RoleEnum::Accounting, 403],
    [RoleEnum::Member, 403],
    [RoleEnum::NonMember, 403],
]);

test('can view a user profile based on role', function ($role, $expectedStatus) {
    $this->seed(RolesAndPermissionsSeeder::class);

    $requester = User::factory()->create()->assignRole($role);
    $targetUser = User::factory()->has(Profile::factory())->create()->assignRole(RoleEnum::NonMember->value);

    actingAs($requester)
        ->get(USER_ENDPOINT.'/'.$targetUser->id)
        ->assertStatus($expectedStatus);
})->with([
    [RoleEnum::Admin, 200],
    [RoleEnum::Accounting, 200],
    [RoleEnum::Member, 403],
    [RoleEnum::NonMember, 403],
]);

test('can update a user based on role', function ($role, $expectedStatus) {
    $this->seed(RolesAndPermissionsSeeder::class);

    $requester = User::factory()->create()->assignRole($role);
    $targetUser = User::factory()->has(Profile::factory())->create()->assignRole(RoleEnum::NonMember->value);

    $data = [
        'first_name' => 'Updated',
    ];

    actingAs($requester)
        ->patch(
            USER_ENDPOINT.'/'.$targetUser->id,
            $data
        )
        ->assertStatus($expectedStatus);
})->with([
    [RoleEnum::Admin, 200],
    [RoleEnum::Accounting, 403],
    [RoleEnum::Member, 403],
    [RoleEnum::NonMember, 403],
]);

test('can delete a user based on role', function ($role, $expectedStatus) {
    $this->seed(RolesAndPermissionsSeeder::class);

    $requester = User::factory()->create()->assignRole($role);
    $targetUser = User::factory()->has(Profile::factory())->create()->assignRole(RoleEnum::NonMember->value);

    actingAs($requester)
        ->delete(USER_ENDPOINT.'/'.$targetUser->id)
        ->assertStatus($expectedStatus);
})->with([
    [RoleEnum::Admin, 200],
    [RoleEnum::Accounting, 403],
    [RoleEnum::Member, 403],
    [RoleEnum::NonMember, 403],
]);

test('can restore a user based on role', function ($role, $expectedStatus) {
    $this->seed(RolesAndPermissionsSeeder::class);

    $requester = User::factory()->create()->assignRole($role);

    $admin = User::factory()->create()->assignRole(RoleEnum::Admin);
    $targetUser = User::factory()->create();

    actingAs($admin)
        ->delete(USER_ENDPOINT.'/'.$targetUser->id)
        ->assertStatus(200);

    actingAs($requester)
        ->patch(USER_ENDPOINT.'/'.$targetUser->id.'/restore')
        ->assertStatus($expectedStatus);
})->with([
    [RoleEnum::Admin, 200],
    [RoleEnum::Accounting, 403],
    [RoleEnum::Member, 403],
    [RoleEnum::NonMember, 403],
]);
