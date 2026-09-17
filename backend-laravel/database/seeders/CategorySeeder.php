<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'Batteries',        'slug' => 'batteries',  'icon' => '🔋',
             'translations' => ['en' => ['name' => 'Batteries']]],
            ['name' => 'Lubrifiants',      'slug' => 'lubricants', 'icon' => '🛢️',
             'translations' => ['en' => ['name' => 'Lubricants']]],
            ['name' => 'Pneus',            'slug' => 'tires',      'icon' => '🛞',
             'translations' => ['en' => ['name' => 'Tires']]],
            ['name' => 'Pièces détachées', 'slug' => 'spareParts', 'icon' => '🔧',
             'translations' => ['en' => ['name' => 'Spare Parts']]],
        ];

        foreach ($categories as $cat) {
            Category::updateOrCreate(['slug' => $cat['slug']], $cat);
        }
    }
}