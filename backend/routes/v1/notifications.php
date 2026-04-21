<?php

use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

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
