<?php
// app/Models/Product.php

namespace App\Models;

use App\Traits\Translatable;
use App\Traits\HasImageUrl;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use Translatable, HasImageUrl;
    protected $fillable = [
        'name',
        'category_id',
        'price',
        'short_description',
        'image',
        'translations',
    ];

    protected $casts = [
        'translations' => 'array'
    ];

    protected $with = ['category'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    // app/Models/Product.php
    protected function translatableRelations(): array
    {
        return ['category'];
    }

}