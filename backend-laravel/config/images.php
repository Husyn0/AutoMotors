<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Models that own an image column
    |--------------------------------------------------------------------------
    | Each entry: the Eloquent model class and the column holding the
    | relative path inside storage/app/public/.
    */
    'tracked' => [
        \App\Models\Product::class   => 'image',
        \App\Models\Category::class  => 'image',
        \App\Models\Project::class   => 'image',
        // Add these once the models gain an image column:
        // \App\Models\Service::class   => 'image',
        // \App\Models\TruckType::class => 'image',
    ],

    /*
    |--------------------------------------------------------------------------
    | Folders under storage/app/public that the reaper may prune
    |--------------------------------------------------------------------------
    | Must match UploadController::ALLOWED_FOLDERS. Files outside this list
    | are never touched, even if they look orphaned.
    */
    'folders' => [
        'products',
        'categories',
        'services',
        'truck-types',
        'projects',
        'settings',
    ],

    /*
    |--------------------------------------------------------------------------
    | Safety
    |--------------------------------------------------------------------------
    | grace_minutes: files younger than this are skipped — gives you a window
    |                to attach a freshly uploaded file to a row.
    | dry_run:       when true, nothing is deleted, only logged.
    */
    'grace_minutes' => 60,
    'dry_run'       => env('IMAGE_REAPER_DRY_RUN', false),
];