<?php
// app/Models/Service.php

namespace App\Models;

use App\Traits\Translatable;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use Translatable;

    protected $fillable = [
        'title',
        'description',
        'translations'
    ];

    protected $casts = [
        'translations' => 'array'
    ];
}