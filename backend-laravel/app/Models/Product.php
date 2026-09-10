<?php
// app/Models/Product.php

namespace App\Models;

use App\Traits\Translatable;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use Translatable;
    protected $fillable = [
        'name',
        'category',
        'price',
        'short_description',
        'image',
        'translations'
    ];

    protected $casts = [
        'translations' => 'array'
    ];
}