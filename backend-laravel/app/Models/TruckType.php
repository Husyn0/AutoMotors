<?php
// app/Models/TruckType.php

namespace App\Models;

use App\Traits\Translatable;
use Illuminate\Database\Eloquent\Model;

class TruckType extends Model
{
    use Translatable;

    protected $fillable = [
        'name',
        'models',
        'icon',
        'description',
        'translations'
    ];

    protected $casts = [
        'translations' => 'array'
    ];
}