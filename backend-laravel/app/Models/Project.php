<?php
// app/Models/Project.php

namespace App\Models;

use App\Traits\Translatable;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use Translatable;

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