// app/Http/Controllers/Api/AuthController.php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Les identifiants sont incorrects.'],
            ]);
        }

        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnecté']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}

// app/Http/Controllers/Api/CompanyController.php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    public function index()
    {
        $company = Company::with([
            'services',
            'advantages',
            'products',
            'vehicleTypes',
            'faqs',
            'galleryImages'
        ])->first();

        if (!$company) {
            // Create default company
            $company = Company::create([
                'name' => 'AUTO MOTORS SARL',
                'about' => 'SPECIALISES DANS LE VENTE DE PIECE AUTOMOBILES (BATTERIE, LUBRIFIANT, PNEU, PIECE DETACHES). NOUS PROPOSONS DES PRODUITS DE QUALITE ET UN SERVICE FIABLE.',
                'mission' => 'FOURNIR PIECE DE QUALITE PRIX COMPETITIFS',
                'vision' => 'Devenir le leader de la distribution automobile en Côte d\'Ivoire.',
                'location' => 'SAN PEDRO GAR CARTIER SOTREF EN FACE DE SACC CACAO',
                'delivery_info' => 'NOUS PROPOSONS EGALEMENT LA LIVRAISON SELON LES BESOIN DE NOS CLIENTS',
                'phones' => ['0749616161', '0778969396', '0708236417'],
                'email' => 'Motorsauto166@gmail.com',
                'social_links' => ['facebook' => '#', 'instagram' => '#', 'linkedin' => '#']
            ]);

            // Create default data
            $services = [
                ['name' => 'Importation de pièces automobiles', 'description' => 'Importation de pièces et équipements automobiles de qualité.', 'order' => 1],
                ['name' => 'Pneus pour véhicules et camions', 'description' => 'Fourniture de pneus adaptés aux différents types de véhicules.', 'order' => 2],
                ['name' => 'Batteries automobiles', 'description' => 'Vente de batteries fiables pour voitures et véhicules professionnels.', 'order' => 3],
                ['name' => 'Lubrifiants et huiles moteur', 'description' => 'Distribution de lubrifiants et huiles moteur TOTAL.', 'order' => 4],
                ['name' => 'Vente en gros', 'description' => 'Fourniture de produits automobiles aux magasins, revendeurs et professionnels.', 'order' => 5],
                ['name' => 'Distribution en Côte d\'Ivoire', 'description' => 'Distribution de nos produits dans différentes régions de la Côte d\'Ivoire.', 'order' => 6],
            ];

            foreach ($services as $svc) {
                $company->services()->create($svc);
            }

            $advantages = [
                'Produits de qualité',
                'Prix compétitifs',
                'Importation fiable',
                'Large gamme de produits',
                'Distribution partout en Côte d\'Ivoire'
            ];

            foreach ($advantages as $i => $adv) {
                $company->advantages()->create(['text' => $adv, 'order' => $i + 1]);
            }

            $products = [
                ['name' => 'Batterie 12V 100Ah', 'category' => 'Batteries', 'price' => 65.00, 'description' => 'Batterie performante pour véhicules légers.', 'image' => '001'],
                ['name' => 'Pneu Michelin 205/55R16', 'category' => 'Pneus', 'price' => 89.00, 'description' => 'Pneu toutes saisons haute qualité.', 'image' => '002'],
                ['name' => 'Huile moteur TOTAL 5W30', 'category' => 'Lubrifiants', 'price' => 32.50, 'description' => 'Huile synthétique pour moteurs essence/diesel.', 'image' => '003'],
                ['name' => 'Pneu camion 12R22.5', 'category' => 'Pneus camion', 'price' => 215.00, 'description' => 'Pneu robuste pour poids lourds.', 'image' => '004'],
                ['name' => 'Batterie camion 200Ah', 'category' => 'Batteries', 'price' => 145.00, 'description' => 'Batterie lourde pour véhicules professionnels.', 'image' => '005'],
            ];

            foreach ($products as $prod) {
                $company->products()->create($prod);
            }

            $vehicleTypes = ['Camionette : Kia Hyundai Canter', 'Poids lourds : Mercedes Sinotruck DAF Renault'];
            foreach ($vehicleTypes as $i => $vt) {
                $company->vehicleTypes()->create(['name' => $vt, 'order' => $i + 1]);
            }

            $faqs = [
                ['question' => 'Quels types de pièces proposez-vous ?', 'answer' => 'Nous proposons des batteries, lubrifiants, pneus et pièces détachées pour véhicules légers et poids lourds.', 'order' => 1],
                ['question' => 'Livrez-vous dans toute la Côte d\'Ivoire ?', 'answer' => 'Oui, nous assurons la livraison dans différentes régions de la Côte d\'Ivoire selon les besoins de nos clients.', 'order' => 2],
                ['question' => 'Proposez-vous des prix de gros ?', 'answer' => 'Oui, nous fournissons les professionnels, magasins et revendeurs avec des tarifs compétitifs.', 'order' => 3],
                ['question' => 'Quelles marques de lubrifiants distribuez-vous ?', 'answer' => 'Nous distribuons principalement les huiles et lubrifiants TOTAL.', 'order' => 4],
            ];

            foreach ($faqs as $faq) {
                $company->faqs()->create($faq);
            }

            $company->load(['services', 'advantages', 'products', 'vehicleTypes', 'faqs', 'galleryImages']);
        }

        return response()->json($company);
    }

    public function update(Request $request)
    {
        $company = Company::first();
        
        $validated = $request->validate([
            'name' => 'nullable|string',
            'about' => 'nullable|string',
            'mission' => 'nullable|string',
            'vision' => 'nullable|string',
            'location' => 'nullable|string',
            'delivery_info' => 'nullable|string',
            'phones' => 'nullable|array',
            'email' => 'nullable|email',
            'social_links' => 'nullable|array',
        ]);

        $company->update($validated);
        return response()->json($company);
    }
}

// app/Http/Controllers/Api/ServiceController.php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        return response()->json(Service::orderBy('order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        $company = \App\Models\Company::first();
        $service = $company->services()->create($validated);
        return response()->json($service, 201);
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => 'nullable|string',
            'description' => 'nullable|string',
            'order' => 'nullable|integer',
        ]);

        $service->update($validated);
        return response()->json($service);
    }

    public function destroy(Service $service)
    {
        $service->delete();
        return response()->json(['message' => 'Service supprimé']);
    }
}