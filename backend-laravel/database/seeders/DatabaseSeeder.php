<?php
// database/seeders/DatabaseSeeder.php

namespace Database\Seeders;

use App\Models\AdminUser;
use App\Models\Product;
use App\Models\Service;
use App\Models\TruckType;
use App\Models\Project;
use App\Models\Setting;
use App\Models\Category;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call(CategorySeeder::class);
        AdminUser::create([
            'name' => 'Admin',
            'email' => 'admin@automotors.com',
            'password' => Hash::make('password123'),
        ]);

        $categories = [
            ['name' => 'Batteries',   'slug' => 'batteries',   'icon' => '🔋',
            'translations' => ['en' => ['name' => 'Batteries']]],
            ['name' => 'Lubrifiants', 'slug' => 'lubricants',  'icon' => '🛢️',
            'translations' => ['en' => ['name' => 'Lubricants']]],
            ['name' => 'Pneus',       'slug' => 'tires',       'icon' => '🛞',
            'translations' => ['en' => ['name' => 'Tires']]],
            ['name' => 'Pièces détachées', 'slug' => 'spareParts', 'icon' => '🔧',
            'translations' => ['en' => ['name' => 'Spare Parts']]],
        ];

        foreach ($categories as $c) {
            Category::create($c);
        }

        $categoryMap = Category::pluck('id', 'slug')->toArray();

        // Products (FR in main fields, EN in translations)
        $products = [
            [
                'name' => 'Batterie Plomb 12V 60Ah',
                'category' => 'batteries',
                'category_id' => $categoryMap['batteries'],
                'price' => 89.00,
                'short_description' => 'Batterie automobile fiable pour démarrage optimal',
                'image' => '/images/battery1.jpg',
                'translations' => [
                    'en' => [
                        'name' => 'Lead Battery 12V 60Ah',
                        'short_description' => 'Reliable car battery for optimal starting',
                    ],
                ],
            ],
            [
                'name' => 'Batterie Lithium 12V 80Ah',
                'category' => 'batteries',
                'category_id' => $categoryMap['batteries'],
                'price' => 149.00,
                'short_description' => 'Batterie lithium haute performance pour véhicules modernes',
                'image' => '/images/battery2.jpg',
                'translations' => [
                    'en' => [
                        'name' => 'Lithium Battery 12V 80Ah',
                        'short_description' => 'High performance lithium battery for modern vehicles',
                    ],
                ],
            ],
            [
                'name' => 'Huile Moteur 5W30 5L',
                'category' => 'lubricants',
                'category_id' => $categoryMap['lubricants'],
                'price' => 45.00,
                'short_description' => 'Huile synthétique haute performance pour moteurs essence',
                'image' => '/images/lubricant1.jpg',
                'translations' => [
                    'en' => [
                        'name' => 'Engine Oil 5W30 5L',
                        'short_description' => 'High performance synthetic oil for gasoline engines',
                    ],
                ],
            ],
            [
                'name' => 'Huile Moteur 10W40 5L',
                'category' => 'lubricants',
                'category_id' => $categoryMap['lubricants'],
                'price' => 38.00,
                'short_description' => 'Huile minérale pour moteurs diesel et essence',
                'image' => '/images/lubricant2.jpg',
                'translations' => [
                    'en' => [
                        'name' => 'Engine Oil 10W40 5L',
                        'short_description' => 'Mineral oil for diesel and gasoline engines',
                    ],
                ],
            ],
            [
                'name' => 'Pneu Été 205/55R16',
                'category' => 'tires',
                'category_id' => $categoryMap['tires'],
                'price' => 120.00,
                'short_description' => 'Pneu été haute performance pour une conduite sécurisée',
                'image' => '/images/tire1.jpg',
                'translations' => [
                    'en' => [
                        'name' => 'Summer Tire 205/55R16',
                        'short_description' => 'High performance summer tire for safe driving',
                    ],
                ],
            ],
            [
                'name' => 'Pneu Hiver 195/65R15',
                'category' => 'tires',
                'category_id' => $categoryMap['tires'],
                'price' => 135.00,
                'short_description' => 'Pneu hiver avec adhérence optimale sur neige',
                'image' => '/images/tire2.jpg',
                'translations' => [
                    'en' => [
                        'name' => 'Winter Tire 195/65R15',
                        'short_description' => 'Winter tire with optimal grip on snow',
                    ],
                ],
            ],
            [
                'name' => 'Plaquettes Frein Avant',
                'category' => 'spareParts',
                'category_id' => $categoryMap['spareParts'],
                'price' => 65.00,
                'short_description' => 'Kit de plaquettes de frein de haute qualité',
                'image' => '/images/brake.jpg',
                'translations' => [
                    'en' => [
                        'name' => 'Front Brake Pads',
                        'short_description' => 'High quality brake pad kit',
                    ],
                ],
            ],
            [
                'name' => 'Filtre à Huile',
                'category' => 'spareParts',
                'category_id' => $categoryMap['spareParts'],
                'price' => 15.00,
                'short_description' => 'Filtre à huile haute efficacité pour moteur',
                'image' => '/images/oilfilter.jpg',
                'translations' => [
                    'en' => [
                        'name' => 'Oil Filter',
                        'short_description' => 'High efficiency engine oil filter',
                    ],
                ],
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        // Services
        $services = [
            [
                'title' => 'Importation de pièces automobiles',
                'description' => 'Importation de pièces et équipements automobiles de qualité.',
                'icon' => '🚢',
                'translations' => [
                    'en' => [
                        'title' => 'Automotive Parts Import',
                        'description' => 'Import of quality automotive parts and equipment.',
                    ],
                ],
            ],
            [
                'title' => 'Pneus pour véhicules et camions',
                'description' => 'Fourniture de pneus adaptés aux différents types de véhicules.',
                'icon' => '🚛',
                'translations' => [
                    'en' => [
                        'title' => 'Tires for Vehicles and Trucks',
                        'description' => 'Supply of tires suited to different vehicle types.',
                    ],
                ],
            ],
            [
                'title' => 'Batteries automobiles',
                'description' => 'Vente de batteries fiables pour voitures et véhicules professionnels.',
                'icon' => '🔋',
                'translations' => [
                    'en' => [
                        'title' => 'Car Batteries',
                        'description' => 'Sale of reliable batteries for cars and professional vehicles.',
                    ],
                ],
            ],
            [
                'title' => 'Lubrifiants et huiles moteur',
                'description' => 'Distribution de lubrifiants et huiles moteur TOTAL.',
                'icon' => '🛢️',
                'translations' => [
                    'en' => [
                        'title' => 'Lubricants and Engine Oils',
                        'description' => 'Distribution of TOTAL lubricants and engine oils.',
                    ],
                ],
            ],
            [
                'title' => 'Vente en gros',
                'description' => 'Fourniture de produits automobiles aux magasins, revendeurs et professionnels.',
                'icon' => '🏪',
                'translations' => [
                    'en' => [
                        'title' => 'Wholesale',
                        'description' => 'Supply of automotive products to stores, resellers and professionals.',
                    ],
                ],
            ],
            [
                'title' => 'Distribution en Côte d\'Ivoire',
                'description' => 'Distribution de nos produits dans différentes régions de la Côte d\'Ivoire.',
                'icon' => '🇨🇮',
                'translations' => [
                    'en' => [
                        'title' => 'Distribution in Côte d\'Ivoire',
                        'description' => 'Distribution of our products across various regions of Côte d\'Ivoire.',
                    ],
                ],
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }

        // Truck Types
        $truckTypes = [
            [
                'name' => 'Camionnette',
                'models' => 'Kia, Hyundai, Canter',
                'icon' => '🚐',
                'description' => 'Véhicules utilitaires légers pour le transport urbain',
                'translations' => [
                    'en' => [
                        'name' => 'Light Truck',
                        'description' => 'Light utility vehicles for urban transport',
                    ],
                ],
            ],
            [
                'name' => 'Poids Lourds',
                'models' => 'Mercedes, Sinotruck, DAF, Renault',
                'icon' => '🚛',
                'description' => 'Camions de transport et semi-remorques pour charges lourdes',
                'translations' => [
                    'en' => [
                        'name' => 'Heavy Truck',
                        'description' => 'Transport trucks and semi-trailers for heavy loads',
                    ],
                ],
            ],
        ];

        foreach ($truckTypes as $truckType) {
            TruckType::create($truckType);
        }

        // Projects
        $projects = [
            [
                'title' => 'Flotte de Transport',
                'description' => 'Équipement complet pour une flotte de 50 camions',
                'image' => '🚛',
                'translations' => [
                    'en' => [
                        'title' => 'Transport Fleet',
                        'description' => 'Complete equipment for a fleet of 50 trucks',
                    ],
                ],
            ],
            [
                'title' => 'Station Service',
                'description' => 'Fourniture de lubrifiants pour une station-service',
                'image' => '⛽',
                'translations' => [
                    'en' => [
                        'title' => 'Service Station',
                        'description' => 'Supply of lubricants for a service station',
                    ],
                ],
            ],
            [
                'title' => 'Garage Partenaire',
                'description' => 'Approvisionnement en pièces détachées pour un garage',
                'image' => '🔧',
                'translations' => [
                    'en' => [
                        'title' => 'Partner Garage',
                        'description' => 'Supply of spare parts for a garage',
                    ],
                ],
            ],
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }

        // Settings — note: we'll handle translated settings separately below
        $settings = [
            ['group' => 'general', 'key' => 'company_name', 'value' => 'AUTOMOTORS', 'type' => 'text'],
            ['group' => 'general', 'key' => 'company_slogan', 'value' => 'Spécialiste en vente de pièces automobiles', 'type' => 'text'],
            ['group' => 'contact', 'key' => 'email_address', 'value' => 'Motorsauto166@gmail.com', 'type' => 'email'],
            ['group' => 'contact', 'key' => 'phone_numbers', 'value' => '0749616161,0778969396,0708236417', 'type' => 'text'],
            ['group' => 'contact', 'key' => 'main_address', 'value' => 'SAN PEDRO GAR CARTIER SOTREF EN FACE DE SACC CACAO', 'type' => 'text'],
            ['group' => 'social', 'key' => 'facebook_url', 'value' => '#', 'type' => 'url'],
            ['group' => 'social', 'key' => 'twitter_url', 'value' => '#', 'type' => 'url'],
            ['group' => 'social', 'key' => 'instagram_url', 'value' => '#', 'type' => 'url'],
            ['group' => 'social', 'key' => 'linkedin_url', 'value' => '#', 'type' => 'url'],

            // English versions of settings that need translation
            ['group' => 'general', 'key' => 'company_slogan_en', 'value' => 'Specialist in automotive parts sales', 'type' => 'text'],
            // Keep address in FR (it's a physical location) — optionally add EN version
            ['group' => 'contact', 'key' => 'main_address_en', 'value' => 'SAN PEDRO GAR CARTIER SOTREF OPPOSITE SACC CACAO', 'type' => 'text'],
        ];

        foreach ($settings as $setting) {
            Setting::create($setting);
        }
    }
}