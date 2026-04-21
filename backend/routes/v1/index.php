<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;

Route::name('users.')->group(base_path('routes/v1/users.php'));
Route::name('notifications.')->group(base_path('routes/v1/notifications.php'));

Route::apiResource('roles', RoleController::class);
Route::apiResource('permissions', PermissionController::class);

Route::prefix('auth/spa')->group(function () {
    Route::get('authenticate', [AuthController::class, 'authenticate']);
    Route::post('login', [AuthController::class, 'login'])->middleware(['guest', 'throttle:5,1']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});
