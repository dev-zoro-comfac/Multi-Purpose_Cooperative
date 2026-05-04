<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoanApplicationController;

Route::post(
    '/v1/auth/spa/loan-applications/{loanApplication}/upload-document',
    [LoanApplicationController::class, 'uploadDocument']
);

Route::patch(
    '/v1/auth/spa/loan-applications/{loanApplication}/submit-for-evaluation',
    [LoanApplicationController::class, 'submitForEvaluation']
);

Route::get(
    '/v1/auth/spa/loan-documents/{loanDocument}/download',
    [LoanApplicationController::class, 'downloadDocument']
);

Route::patch(
    '/v1/auth/spa/loan-applications/{loanApplication}/approve',
    [LoanApplicationController::class, 'approve']
);

Route::patch(
    '/v1/auth/spa/loan-applications/{loanApplication}/reject',
    [LoanApplicationController::class, 'reject']
);

Route::get(
    '/v1/auth/spa/loan-applications',
    [LoanApplicationController::class, 'index']
);