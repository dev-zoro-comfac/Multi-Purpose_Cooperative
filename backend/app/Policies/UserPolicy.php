<?php

namespace App\Policies;

use App\Enums\Permissions\UserPermissionEnum;
use App\Models\User;

class UserPolicy
{
    /**
     * Automatically grant all permissions to super admins.
     */
    public function before(User $requester, string $ability): ?bool
    {
        if ($requester->hasRole('super-admin')) {
            return true;
        }

        return null; // Let Laravel check the specific policy method
    }

    public function viewAny(User $requester): bool
    {
        $conditions = [
            $requester->hasRole('super-admin'),
        ];

        return in_array(true, $conditions, true);
    }

    public function view(User $requester, User $user): bool
    {
        $conditions = [
            $requester->hasRole('super-admin'),
            $requester->id === $user->id,
            $requester->can(UserPermissionEnum::ViewAny->value),
        ];

        return in_array(true, $conditions, true);
    }

    public function create(User $requester): bool
    {
        $conditions = [
            $requester->hasRole('super-admin'),
            $requester->can(UserPermissionEnum::Create->value),
        ];

        return in_array(true, $conditions, true);
    }

    public function update(User $requester, User $user): bool
    {
        $conditions = [
            $requester->hasRole('super-admin'),
            $requester->id === $user->id,
            !$requester->id === $user->id && $requester->can(UserPermissionEnum::Update->value),
        ];

        return in_array(true, $conditions, true);
    }

    public function delete(User $requester): bool
    {
        $conditions = [
            $requester->hasRole('super-admin'),
        ];

        return in_array(true, $conditions, true);
    }

    public function restore(User $requester): bool
    {
        $conditions = [
            $requester->hasRole('super-admin'),
        ];

        return in_array(true, $conditions, true);
    }

    public function forceDelete(User $requester, User $user): bool
    {
        $conditions = [
            $requester->hasRole('super-admin'),
        ];

        return in_array(true, $conditions, true);
    }

    public function import(User $requester): bool
    {
        $conditions = [
            $requester->hasRole('super-admin'),
        ];

        return in_array(true, $conditions, true);
    }

    public function export(User $requester): bool
    {
        $conditions = [
            $requester->hasRole('super-admin'),
        ];

        return in_array(true, $conditions, true);
    }
}
