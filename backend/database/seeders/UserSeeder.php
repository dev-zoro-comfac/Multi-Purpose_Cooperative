<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()
            ->count(10)
            ->has(Profile::factory())
            ->create()
            ->each(fn($user) => $user->assignRole(RoleEnum::Admin->value));


        User::factory()
            ->count(10)
            ->has(Profile::factory())
            ->create()
            ->each(fn($user) => $user->assignRole(RoleEnum::Employee->value));


        User::factory()
            ->count(10)
            ->has(Profile::factory())
            ->create()
            ->each(fn($user) => $user->assignRole(RoleEnum::User->value));
    }
}
