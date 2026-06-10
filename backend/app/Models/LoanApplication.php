<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoanApplication extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'submitted_for_evaluation';

    public const STATUS_REVIEWED = 'reviewed';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    public const STATUS_RELEASED = 'released';

    protected $fillable = [
        'application_no',
        'application_source',
        'declared_member_status',
        'declared_member_no',

        'member_id',
        'loan_type',
        'payment_frequency',
        'preferred_payment_method',
        'computation_method',
        'purpose',

        'borrower_name',
        'borrower_address',
        'borrower_email',
        'borrower_contact_number',
        'borrower_age',
        'borrower_civil_status',
        'borrower_employer',
        'borrower_position',
        'borrower_length_of_service',

        'amount_requested',
        'annual_rate',
        'number_of_paydays',
        'processing_fee',
        'total_contribution',
        'outstanding_loan_balance',

        'take_home_pay_15',
        'take_home_pay_30',
        'is_coop_member',
        'member_since',

        'co_maker_name',
        'co_maker_email',
        'co_maker_contact_number',
        'co_maker_address',
        'co_maker_age',
        'co_maker_civil_status',
        'co_maker_employer',
        'co_maker_length_of_service',

        'amortization_per_payday',
        'monthly_amortization',
        'total_interest',
        'total_amount_payable',
        'net_proceeds',

        'status',
        'accounting_notes',
        'submitted_at',
        'reviewed_at',
        'approved_at',
        'rejected_at',
        'released_at',
        'reviewed_by',
        'approved_by',
    ];

    public function amortizations()
    {
        return $this->hasMany(LoanAmortization::class);
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function documents()
    {
        return $this->hasMany(LoanDocument::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(LoanActivityLog::class, 'loan_application_id');
    }
}
