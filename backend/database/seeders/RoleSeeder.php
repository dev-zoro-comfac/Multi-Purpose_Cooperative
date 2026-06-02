<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            'admin',
            'accounting',
            'user',
        ];

        foreach ($roles as $roleName) {
            Role::firstOrCreate(
                [
                    'name' => $roleName,
                    'guard_name' => 'web',
                ],
                [
                    'id' => (string) Str::uuid(),
                ]
            );
        }
    }
}
