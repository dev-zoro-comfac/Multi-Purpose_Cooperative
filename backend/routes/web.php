<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/sanctum/csrf-cookie', function (Request $request) {
    return response()->noContent();
});

Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);
