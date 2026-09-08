// database/seeders/DatabaseSeeder.php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AdminUser;
use App\Models\Product;
use App\Models\Service;
use App\Models\TruckType;
use App\Models\Project;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Create admin user
        AdminUser::create([
            'name' => 'Admin',
            'email' => 'admin@automotors.com',
            'password' => Hash::make('password123'),
        ]);

        // Products
        $products = [
            [
                'name' => 'Batterie Plomb 12V 60Ah',
                'category' => 'batteries',
                'price' => 89.00,
                'short_description' => 'Batterie automobile fiable pour démarrage optimal',
                'image' => '/images/battery1.jpg'
            ],
            [
                'name' => 'Batterie Lithium 12V 80Ah',
                'category' => 'batteries',
                'price' => 149.00,
                'short_description' => 'Batterie lithium haute performance pour véhicules modernes',
                'image' => '/images/battery2.jpg'
            ],
            [
                'name' => 'Huile Moteur 5W30 5L',
                'category' => 'lubricants',
                'price' => 45.00,
                'short_description' => 'Huile synthétique haute performance pour moteurs essence',
                'image' => '/images/lubricant1.jpg'
            ],
            [
                'name' => 'Huile Moteur 10W40 5L',
                'category' => 'lubricants',
                'price' => 38.00,
                'short_description' => 'Huile minérale pour moteurs diesel et essence',
                'image' => '/images/lubricant2.jpg'
            ],
            [
                'name' => 'Pneu Été 205/55R16',
                'category' => 'tires',
                'price' => 120.00,
                'short_description' => 'Pneu été haute performance pour une conduite sécurisée',
                'image' => '/images/tire1.jpg'
            ],
            [
                'name' => 'Pneu Hiver 195/65R15',
                'category' => 'tires',
                'price' => 135.00,
                'short_description' => 'Pneu hiver avec adhérence optimale sur neige',
                'image' => '/images/tire2.jpg'
            ],
            [
                'name' => 'Plaquettes Frein Avant',
                'category' => 'spareParts',
                'price' => 65.00,
                'short_description' => 'Kit de plaquettes de frein de haute qualité',
                'image' => '/images/brake.jpg'
            ],
            [
                'name' => 'Filtre à Huile',
                'category' => 'spareParts',
                'price' => 15.00,
                'short_description' => 'Filtre à huile haute efficacité pour moteur',
                'image' => '/images/oilfilter.jpg'
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
        }

        // Services
        $services = [
            [
                'title' => 'Importation de pièces automobiles',
                'description' => 'Importation de pièces et équipements automobiles de qualité.',
                'icon' => '🚢'
            ],
            [
                'title' => 'Pneus pour véhicules et camions',
                'description' => 'Fourniture de pneus adaptés aux différents types de véhicules.',
                'icon' => '🚛'
            ],
            [
                'title' => 'Batteries automobiles',
                'description' => 'Vente de batteries fiables pour voitures et véhicules professionnels.',
                'icon' => '🔋'
            ],
            [
                'title' => 'Lubrifiants et huiles moteur',
                'description' => 'Distribution de lubrifiants et huiles moteur TOTAL.',
                'icon' => '🛢️'
            ],
            [
                'title' => 'Vente en gros',
                'description' => 'Fourniture de produits automobiles aux magasins, revendeurs et professionnels.',
                'icon' => '🏪'
            ],
            [
                'title' => 'Distribution en Côte d\'Ivoire',
                'description' => 'Distribution de nos produits dans différentes régions de la Côte d\'Ivoire.',
                'icon' => '🇨🇮'
            ]
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
                'description' => 'Véhicules utilitaires légers pour le transport urbain'
            ],
            [
                'name' => 'Poids Lourds',
                'models' => 'Mercedes, Sinotruck, DAF, Renault',
                'icon' => '🚛',
                'description' => 'Camions de transport et semi-remorques pour charges lourdes'
            ]
        ];

        foreach ($truckTypes as $truckType) {
            TruckType::create($truckType);
        }

        // Projects
        $projects = [
            [
                'title' => 'Flotte de Transport',
                'description' => 'Équipement complet pour une flotte de 50 camions',
                'image' => '🚛'
            ],
            [
                'title' => 'Station Service',
                'description' => 'Fourniture de lubrifiants pour une station-service',
                'image' => '⛽'
            ],
            [
                'title' => 'Garage Partenaire',
                'description' => 'Approvisionnement en pièces détachées pour un garage',
                'image' => '🔧'
            ]
        ];

        foreach ($projects as $project) {
            Project::create($project);
        }

        // Settings
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
        ];

        foreach ($settings as $setting) {
            \App\Models\Setting::create($setting);
        }
    }
}