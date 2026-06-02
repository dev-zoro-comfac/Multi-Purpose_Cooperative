<?php

use App\Http\Controllers\Api\V1\MemberController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\LoanApplicationController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('auth/spa/csrf-cookie', function (Request $request) {
    return response()->noContent();
});

Route::prefix('auth/spa')->group(function () {
    Route::get('authenticate', [AuthController::class, 'authenticate']);
    Route::post('login', [AuthController::class, 'login'])->middleware(['guest', 'throttle:5,1']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
});

Route::name('users.')->group(base_path('routes/v1/users.php'));
Route::name('notifications.')->group(base_path('routes/v1/notifications.php'));

Route::apiResource('roles', RoleController::class);
Route::apiResource('permissions', PermissionController::class);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('loan-applications/calculate', [LoanApplicationController::class, 'calculate']);
    Route::get('loan-applications-dashboard', [LoanApplicationController::class, 'dashboard']);
    Route::apiResource('loan-applications', LoanApplicationController::class);
    Route::post('loan-applications/{loanApplication}/generate-documents', [LoanApplicationController::class, 'generateDocuments']);
    Route::post('loan-applications/{loanApplication}/upload-document', [LoanApplicationController::class, 'uploadDocument']);
    Route::patch('loan-applications/{loanApplication}/submit-for-evaluation', [LoanApplicationController::class, 'submitForEvaluation']);
    Route::patch('loan-applications/{loanApplication}/review', [LoanApplicationController::class, 'review']);
    Route::patch('loan-applications/{loanApplication}/approve', [LoanApplicationController::class, 'approve']);
    Route::patch('loan-applications/{loanApplication}/reject', [LoanApplicationController::class, 'reject']);
    Route::patch('loan-applications/{loanApplication}/release', [LoanApplicationController::class, 'release']);
    Route::get('loan-applications/{loanApplication}/pdf', [LoanApplicationController::class, 'downloadPdf']);
    Route::get('loan-documents/{loanDocument}/download', [LoanApplicationController::class, 'downloadDocument']);

    Route::post('members/{member}/send-password-setup', [MemberController::class, 'sendPasswordSetup']);
    Route::apiResource('members', MemberController::class);
});
