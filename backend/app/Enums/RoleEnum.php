<?php

namespace App\Enums;

enum RoleEnum: string
{
    case SuperAdmin = 'super-admin';
    case Admin = 'admin';
    case Accounting = 'accounting';
    case Member = 'member';
    case Employee = 'employee';
    case User = 'user';

    public function label(): string
    {
        return match ($this) {
            static::SuperAdmin => 'Super Admins',
            static::Admin => 'Admins',
            static::Accounting => 'Accounting Staff',
            static::Member => 'Members',
            static::Employee => 'Employees',
            static::User => 'Users',
        };
    }
}