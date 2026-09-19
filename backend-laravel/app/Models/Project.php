<?php
// app/Models/Project.php

namespace App\Models;

use App\Traits\Translatable;
use App\Traits\HasImageUrl;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use Translatable, HasImageUrl;

    protected $fillable = [
        'title',
        'description',
        'image',
        'translations'
    ];

    protected $casts = [
        'translations' => 'array'
    ];
}