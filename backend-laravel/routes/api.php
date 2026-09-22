<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\TruckTypeController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\UploadController;


Route::middleware('throttle:api')->group(function () {
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/products',       [ProductController::class,   'index']);
    Route::get('/services',       [ServiceController::class,   'index']);
    Route::get('/truck-types',    [TruckTypeController::class, 'index']);
    Route::get('/projects',       [ProjectController::class,   'index']);
    Route::get('/settings',       [SettingController::class,   'index']);

    // File serving — moderately limited, files are bandwidth-heavy
    /*
    |--------------------------------------------------------------------------
    | File serving (public)
    |--------------------------------------------------------------------------
    | Symlink path is preferred:  GET /storage/{folder}/{file}
    | Fallback / auth-friendly:   GET /api/files/{folder}/{file}
    */
    Route::get('/files/{folder}/{file}', [UploadController::class, 'show'])
        ->middleware('throttle:60,1')
        ->whereIn('folder', App\Http\Controllers\Api\UploadController::ALLOWED_FOLDERS)
        ->where('file', '[^/]+');
});



/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/
Route::post('/auth/login',    [AuthController::class, 'login'])
    ->middleware('throttle:20,1');
Route::post('/auth/register', [AuthController::class, 'register'])
    ->middleware('throttle:5,60');
Route::post('/auth/refresh',  [AuthController::class, 'refresh'])
    ->middleware('throttle:30,1');

// Public content read (frontend visitors by id)
Route::get('/categories/{id}',  [CategoryController::class, 'show']);
Route::get('/products/{id}',  [ProductController::class,   'show']);
Route::get('/services/{id}',  [ServiceController::class,   'show']);
Route::get('/truck-types/{id}',[TruckTypeController::class,'show']);
Route::get('/projects/{id}',  [ProjectController::class,   'show']);


/*
|--------------------------------------------------------------------------
| Protected routes (admin only)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    Route::middleware('throttle:api-writes')->group(function () {
        // Categories
        Route::post  ('/categories',      [CategoryController::class, 'store']);
        Route::put   ('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

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

    /*
    |--------------------------------------------------------------------------
    | File uploads (protected)
    |--------------------------------------------------------------------------
    // */
    // Route::post  ('/uploads/{folder}',        [UploadController::class, 'store']);
    // Route::delete('/uploads/{folder}/{file}', [UploadController::class, 'destroy']);
    Route::middleware('throttle:uploads')->group(function () {
        Route::post  ('/uploads/{folder}',        [UploadController::class, 'store'])
            ->whereIn('folder', \App\Http\Controllers\Api\UploadController::ALLOWED_FOLDERS);

        Route::delete('/uploads/{folder}/{file}', [UploadController::class, 'destroy'])
            ->whereIn('folder', \App\Http\Controllers\Api\UploadController::ALLOWED_FOLDERS)
            ->where('file', '[^/]+'); // single segment only — no traversal, no nested dirs   
    }); 
});