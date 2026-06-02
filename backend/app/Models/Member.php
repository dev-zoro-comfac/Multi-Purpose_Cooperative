<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $fillable = [
        'user_id',
        'member_no',
        'first_name',
        'middle_name',
        'last_name',
        'suffix',
        'birth_date',
        'gender',
        'civil_status',
        'email',
        'contact_number',
        'address',
        'employment_status',
        'department',
        'position',
        'share_capital',
        'total_contribution',
        'status',
    ];
}
