<?php
// app/Models/TruckType.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TruckType extends Model
{
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