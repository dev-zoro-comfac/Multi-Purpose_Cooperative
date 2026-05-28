<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
        ]);

        $users = [
            [
                'email' => 'super.admin@test.com',
                'role' => RoleEnum::SuperAdmin->value,
                'first_name' => 'SUPER',
                'last_name' => 'ADMIN',
            ],
            [
                'email' => 'admin@test.com',
                'role' => RoleEnum::Admin->value,
                'first_name' => 'ADMIN',
                'last_name' => 'ADMIN',
            ],
            [
                'email' => 'accounting@test.com',
                'role' => RoleEnum::Accounting->value,
                'first_name' => 'ACCOUNTING',
                'last_name' => 'ACCOUNTING',
            ],
            [
                'email' => 'member@test.com',
                'role' => RoleEnum::Member->value,
                'first_name' => 'MEMBER',
                'last_name' => 'MEMBER',
            ],
            [
                'email' => 'employee@test.com',
                'role' => RoleEnum::Employee->value,
                'first_name' => 'EMPLOYEE',
                'last_name' => 'EMPLOYEE',
            ],
            [
                'email' => 'user@test.com',
                'role' => RoleEnum::User->value,
                'first_name' => 'USER',
                'last_name' => 'USER',
            ],
        ];

        foreach ($users as $userData) {

            $user = User::factory()->create([
                'email' => $userData['email'],
                'password' => Hash::make('Test@123'),
            ]);

            $user->assignRole($userData['role']);

            $user->profile()->save(
                Profile::factory()->make([
                    'first_name' => $userData['first_name'],
                    'last_name' => $userData['last_name'],
                    'middle_name' => null,
                    'contact_number' => '09999999999',
                ])
            );
        }
    }
}