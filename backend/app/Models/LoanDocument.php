<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LoanDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'loan_application_id',
        'document_type',
        'file_name',
        'file_path',
        'status',
        'is_signed',
        'generated_at',
        'uploaded_at',
    ];

    protected $casts = [
        'is_signed' => 'boolean',
        'generated_at' => 'datetime',
        'uploaded_at' => 'datetime',
    ];

    public function loanApplication()
    {
        return $this->belongsTo(LoanApplication::class);
    }
}