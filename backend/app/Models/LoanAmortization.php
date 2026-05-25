<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LoanAmortization extends Model
{
    protected $fillable = [
        'loan_application_id',
        'payday_no',
        'amortization',
        'interest',
        'principal',
        'balance',
    ];

    public function loanApplication()
    {
        return $this->belongsTo(LoanApplication::class);
    }
}