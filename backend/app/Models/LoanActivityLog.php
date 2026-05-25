<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class LoanActivityLog extends Model
{
    use HasUlids;

    protected $fillable = [
        'loan_application_id',
        'user_id',
        'action',
        'notes',
    ];

    public function loanApplication()
    {
        return $this->belongsTo(LoanApplication::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(LoanActivityLog::class);
    }
}