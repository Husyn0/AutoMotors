// routes/api.php
<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\FaqController;
use App\Http\Controllers\Api\GalleryController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/company', [CompanyController::class, 'index']);

// Admin routes (protected)
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // Company
    Route::put('/company', [CompanyController::class, 'update']);
    
    // Services
    Route::apiResource('/services', ServiceController::class);
    
    // Products
    Route::apiResource('/products', ProductController::class);
    
    // FAQs
    Route::apiResource('/faqs', FaqController::class);
    
    // Gallery
    Route::apiResource('/gallery', GalleryController::class);
    Route::post('/gallery/upload', [GalleryController::class, 'upload']);
});
