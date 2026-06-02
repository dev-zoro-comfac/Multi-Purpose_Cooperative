<?php

namespace App\Enums;

enum RoleEnum: string
{
    case Admin = 'admin';
    case Accounting = 'accounting';
    case Member = 'member';
    case NonMember = 'non-member';

    public function label(): string
    {
        return match ($this) {
            self::Admin => 'Admins',
            self::Accounting => 'Accounting Staff',
            self::Member => 'Members',
            self::NonMember => 'Non-Members',
        };
    }
}
