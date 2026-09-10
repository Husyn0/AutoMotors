<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\TruckTypeController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SettingController;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/
Route::post('/auth/login',    [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/refresh',  [AuthController::class, 'refresh']);

// Public content read (frontend visitors)
Route::get('/products',       [ProductController::class,   'index']);
Route::get('/products/{id}',  [ProductController::class,   'show']);
Route::get('/services',       [ServiceController::class,   'index']);
Route::get('/services/{id}',  [ServiceController::class,   'show']);
Route::get('/truck-types',    [TruckTypeController::class, 'index']);
Route::get('/truck-types/{id}',[TruckTypeController::class,'show']);
Route::get('/projects',       [ProjectController::class,   'index']);
Route::get('/projects/{id}',  [ProjectController::class,   'show']);
Route::get('/settings',       [SettingController::class,   'index']);

/*
|--------------------------------------------------------------------------
| Protected routes (admin only)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // Products
    Route::post  ('/products',      [ProductController::class,   'store']);
    Route::put   ('/products/{id}', [ProductController::class,   'update']);
    Route::delete('/products/{id}', [ProductController::class,   'destroy']);

    // Services
    Route::post  ('/services',      [ServiceController::class,   'store']);
    Route::put   ('/services/{id}', [ServiceController::class,   'update']);
    Route::delete('/services/{id}', [ServiceController::class,   'destroy']);

    // Truck Types
    Route::post  ('/truck-types',      [TruckTypeController::class, 'store']);
    Route::put   ('/truck-types/{id}', [TruckTypeController::class, 'update']);
    Route::delete('/truck-types/{id}', [TruckTypeController::class, 'destroy']);

    // Projects
    Route::post  ('/projects',      [ProjectController::class,   'store']);
    Route::put   ('/projects/{id}', [ProjectController::class,   'update']);
    Route::delete('/projects/{id}', [ProjectController::class,   'destroy']);

    // Settings
    Route::put('/settings', [SettingController::class, 'update']);
});