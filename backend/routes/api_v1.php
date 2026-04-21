<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::patch('users/{user}/restore', [UserController::class, 'restore'])->name('users.restore');
Route::patch('users/{user}/profile', [ProfileController::class, 'update']);
Route::patch('users/{user}/role', [UserController::class, 'updateRole']);
Route::patch('users/{user}/password', [UserController::class, 'updatePassword']);
Route::post('users/import', [UserController::class, 'import'])->name('import');
Route::get('users/import/template', [UserController::class, 'downloadImportTemplate'])->name('download.import.template');
Route::get('users/export', [UserController::class, 'export'])->name('export');
Route::get('users/export/download/{filename}', [UserController::class, 'downloadExportFile'])->name('download.export.file');
Route::apiResource('users', UserController::class);

Route::prefix('notifications')->group(function () {
    Route::controller(NotificationController::class)->group(function () {
        Route::get('/', 'list')->name('notifications.list');
        Route::get('/overview', 'overview')->name('notifications.overview');
        Route::post('/read-all', 'readAll')->name('notifications.read.all');
        Route::delete('/', 'deleteAll')->name('notifications.delete.all');
        Route::post('/{notificationId}', 'read')->name('notifications.read');
        Route::delete('/{notificationId}', 'delete')->name('notifications.delete');
    });
});


Route::prefix('auth/spa')->group(function () {
    Route::get('authenticate', [AuthController::class, 'authenticate']);
    Route::post('login', [AuthController::class, 'login'])->middleware('guest');
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});
