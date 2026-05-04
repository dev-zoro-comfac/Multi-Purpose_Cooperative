<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoanApplicationController;

Route::name('users.')->group(base_path('routes/v1/users.php'));
Route::name('notifications.')->group(base_path('routes/v1/notifications.php'));

Route::apiResource('roles', RoleController::class);
Route::apiResource('permissions', PermissionController::class);

Route::prefix('auth/spa')->group(function () {
    Route::get('authenticate', [AuthController::class, 'authenticate']);
    Route::post('login', [AuthController::class, 'login'])->middleware(['guest', 'throttle:5,1']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

    Route::apiResource('loan-applications', LoanApplicationController::class);

Route::post(
    'loan-applications/{loanApplication}/generate-documents',
    [LoanApplicationController::class, 'generateDocuments']
);

Route::post(
    'loan-applications/{loanApplication}/upload-document',
    [LoanApplicationController::class, 'uploadDocument']
);

Route::patch(
    'loan-applications/{loanApplication}/submit-for-evaluation',
    [LoanApplicationController::class, 'submitForEvaluation']
);

Route::get(
    'loan-documents/{loanDocument}/download',
    [LoanApplicationController::class, 'downloadDocument']
);
});
