<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('users')->group(function () {
    Route::controller(UserController::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');

        Route::get('options', 'listOptions');
        Route::get('infinite-list', 'infiniteList');

        Route::patch('{user}/restore', 'restore')->name('users.restore');
        Route::patch('{user}/role', 'updateRole');
        Route::patch('{user}/password', 'updatePassword');
        Route::post('import', 'import')->name('import');
        Route::get('import/template', 'downloadImportTemplate')->name('download.import.template');
        Route::get('export', 'export')->name('export');
        Route::get('export/download/{filename}', 'downloadExportFile')->name('download.export.file');



        Route::get('{user}', 'show')->name('show');
        Route::put('{user}', 'update')->name('update.put');
        Route::patch('{user}', 'update')->name('update.patch');
        Route::delete('{user}', 'destroy')->name('destroy');
    });

    Route::patch('{user}/profile', [ProfileController::class, 'update']);
});
