// routes/api.php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContentController;

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/refresh', [AuthController::class, 'refresh']);

// Protected routes
Route::middleware('auth:api')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    
    // Content management routes
    Route::prefix('content')->group(function () {
        // Products
        Route::get('/products', [ContentController::class, 'getProducts']);
        Route::get('/products/{id}', [ContentController::class, 'getProduct']);
        Route::post('/products', [ContentController::class, 'createProduct']);
        Route::put('/products/{id}', [ContentController::class, 'updateProduct']);
        Route::delete('/products/{id}', [ContentController::class, 'deleteProduct']);
        
        // Services
        Route::get('/services', [ContentController::class, 'getServices']);
        Route::get('/services/{id}', [ContentController::class, 'getService']);
        Route::post('/services', [ContentController::class, 'createService']);
        Route::put('/services/{id}', [ContentController::class, 'updateService']);
        Route::delete('/services/{id}', [ContentController::class, 'deleteService']);
        
        // Truck Types
        Route::get('/truck-types', [ContentController::class, 'getTruckTypes']);
        Route::get('/truck-types/{id}', [ContentController::class, 'getTruckType']);
        Route::post('/truck-types', [ContentController::class, 'createTruckType']);
        Route::put('/truck-types/{id}', [ContentController::class, 'updateTruckType']);
        Route::delete('/truck-types/{id}', [ContentController::class, 'deleteTruckType']);
        
        // Projects
        Route::get('/projects', [ContentController::class, 'getProjects']);
        Route::get('/projects/{id}', [ContentController::class, 'getProject']);
        Route::post('/projects', [ContentController::class, 'createProject']);
        Route::put('/projects/{id}', [ContentController::class, 'updateProject']);
        Route::delete('/projects/{id}', [ContentController::class, 'deleteProject']);
        
        // Settings
        Route::get('/settings', [ContentController::class, 'getSettings']);
        Route::put('/settings', [ContentController::class, 'updateSettings']);
    });
});