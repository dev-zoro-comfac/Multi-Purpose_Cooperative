<?php

namespace App\Enums\Permissions;

enum PermissionPermissionEnum: string
{
    case ViewMany = 'view many permission';
    case ViewOne = 'view one permission';
    case ViewAny = 'view any permission';
    case ViewOwn = 'view own permission';
    case ViewProtectedData = 'view permission protected data';
}
