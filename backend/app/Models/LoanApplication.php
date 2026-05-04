<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LoanApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'application_no',
        'borrower_name',
        'borrower_address',
        'borrower_age',
        'borrower_civil_status',
        'borrower_employer',
        'borrower_length_of_service',
        'amount_requested',
        'take_home_pay_15',
        'take_home_pay_30',
        'is_coop_member',
        'member_since',
        'co_maker_name',
        'co_maker_address',
        'co_maker_age',
        'co_maker_civil_status',
        'co_maker_employer',
        'co_maker_length_of_service',
        'status',
        'accounting_notes',
        'submitted_at',
        'approved_at',
        'rejected_at',
    ];

    protected $casts = [
        'is_coop_member' => 'boolean',
        'member_since' => 'date',
        'submitted_at' => 'datetime',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
        'amount_requested' => 'decimal:2',
        'take_home_pay_15' => 'decimal:2',
        'take_home_pay_30' => 'decimal:2',
    ];

    public function documents()
    {
        return $this->hasMany(LoanDocument::class);
    }
}