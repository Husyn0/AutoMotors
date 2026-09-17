<?php
// app/Models/Service.php

namespace App\Models;

use App\Traits\Translatable;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use Translatable;

    public const TYPES = ['srv', 'adv'];

    protected $fillable = [
        'title',
        'type',
        'description',
        'translations'
    ];

    protected $casts = [
        'translations' => 'array'
    ];

    /**
     * Scope: Service::ofType('adv')->get()
     */
    public function scopeOfType($query, ?string $type)
    {
        if (in_array($type, self::TYPES, true)) {
            return $query->where('type', $type);
        }
        return $query;
    }
}