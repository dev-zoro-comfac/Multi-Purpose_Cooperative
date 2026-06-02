<?php

namespace Database\Seeders;

use App\Enums\Permissions\PermissionPermissionEnum;
use App\Enums\Permissions\RolePermissionEnum;
use App\Enums\Permissions\UserPermissionEnum;
use App\Enums\RoleEnum;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        DB::transaction(function () {
            foreach (UserPermissionEnum::cases() as $permission) {
                Permission::firstOrCreate(
                    ['name' => $permission->value],
                    ['category' => 'user']
                );
            }

            foreach (RolePermissionEnum::cases() as $permission) {
                Permission::firstOrCreate(
                    ['name' => $permission->value],
                    ['category' => 'role']
                );
            }

            foreach (PermissionPermissionEnum::cases() as $permission) {
                Permission::firstOrCreate(
                    ['name' => $permission->value],
                    ['category' => 'permission']
                );
            }
        });

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $admin = Role::firstOrCreate([
            'name' => RoleEnum::Admin->value,
            'guard_name' => 'web',
        ]);

        $accounting = Role::firstOrCreate([
            'name' => RoleEnum::Accounting->value,
            'guard_name' => 'web',
        ]);

        $member = Role::firstOrCreate([
            'name' => RoleEnum::Member->value,
            'guard_name' => 'web',
        ]);

        $nonMember = Role::firstOrCreate([
            'name' => RoleEnum::NonMember->value,
            'guard_name' => 'web',
        ]);

        $admin->givePermissionTo([
            UserPermissionEnum::ViewMany->value,
            UserPermissionEnum::ViewOne->value,
            UserPermissionEnum::ViewAny->value,
            UserPermissionEnum::ViewOwn->value,
            UserPermissionEnum::ViewOptions->value,
            UserPermissionEnum::ViewProtectedData->value,
            UserPermissionEnum::Create->value,
            UserPermissionEnum::Update->value,
            UserPermissionEnum::SoftDelete->value,
            UserPermissionEnum::HardDelete->value,
            UserPermissionEnum::Restore->value,
            UserPermissionEnum::Import->value,
            UserPermissionEnum::Export->value,

            RolePermissionEnum::ViewMany->value,
            RolePermissionEnum::ViewOne->value,
            RolePermissionEnum::ViewAny->value,
            RolePermissionEnum::ViewOwn->value,
            RolePermissionEnum::ViewProtectedData->value,
            RolePermissionEnum::Create->value,
            RolePermissionEnum::Update->value,
            RolePermissionEnum::HardDelete->value,

            PermissionPermissionEnum::ViewMany->value,
            PermissionPermissionEnum::ViewOne->value,
            PermissionPermissionEnum::ViewAny->value,
            PermissionPermissionEnum::ViewOwn->value,
            PermissionPermissionEnum::ViewProtectedData->value,
        ]);

        $accounting->givePermissionTo([
            UserPermissionEnum::ViewMany->value,
            UserPermissionEnum::ViewOne->value,
            UserPermissionEnum::ViewAny->value,
            UserPermissionEnum::ViewOwn->value,
            UserPermissionEnum::Update->value,
        ]);

        $member->givePermissionTo([
            UserPermissionEnum::ViewOwn->value,
            UserPermissionEnum::Update->value,
        ]);

        $nonMember->givePermissionTo([
            UserPermissionEnum::ViewOwn->value,
            UserPermissionEnum::Update->value,
        ]);

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
