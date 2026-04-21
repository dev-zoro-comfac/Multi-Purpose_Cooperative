<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            RolesAndPermissionsSeeder::class,
        ]);

        $superAdmin = User::factory()
            ->create([
                'email' => 'super.admin@test.com',
                'password' => Hash::make('Test@123'),
            ])->assignRole(RoleEnum::SuperAdmin->value);

        $admin = User::factory()
            ->create([
                'email' => 'admin@test.com',
                'password' => Hash::make('Test@123'),
            ])->assignRole(RoleEnum::Admin->value);


        $employee = User::factory()
            ->create([
                'email' => 'employee@test.com',
                'password' => Hash::make('Test@123'),
            ])->assignRole(RoleEnum::Employee->value);

        $user = User::factory()
            ->create([
                'email' => 'user@test.com',
                'password' => Hash::make('Test@123'),
            ])->assignRole(RoleEnum::User->value);

        $superAdmin->profile()->save(
            Profile::factory()->make(
                [
                    'first_name' => 'SUPER',
                    'last_name' => 'ADMIN',
                    'middle_name' => null,
                    'contact_number' => "09999999999",
                ]
            )
        );

        $admin->profile()->save(
            Profile::factory()->make(
                [
                    'first_name' => 'ADMIN',
                    'last_name' => 'ADMIN',
                    'middle_name' => null,
                    'contact_number' => "09999999999",
                ]
            )
        );
        
        $employee->profile()->save(
            Profile::factory()->make(
                [
                    'first_name' => 'EMPLOYEE',
                    'last_name' => 'EMPLOYEE',
                    'middle_name' => null,
                    'contact_number' => "09999999999",
                ]
            )
        );

        $user->profile()->save(
            Profile::factory()->make(
                [
                    'first_name' => 'USER',
                    'last_name' => 'USER',
                    'middle_name' => null,
                    'contact_number' => "09999999999",
                ]
            )
        );

        $this->call([
            // UserSeeder::class,
        ]);
    }
}
