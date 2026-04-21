<?php

namespace App\Enums\Permissions;

enum UserPermissionEnum: string
{
    case ViewMany = 'view many user';
    case ViewOne = 'view one user';
    case ViewAny = 'view any user';
    case ViewOwn = 'view own user';
    case ViewOptions = 'view user options';
    case ViewProtectedData = 'view user protected data';
    case Create = 'create user';
    case Update = 'update user';
    case SoftDelete = 'soft delete user';
    case HardDelete = 'hard delete user';
    case Restore = 'restore user';
    case Import = 'import user';
    case Export = 'export user';
}
