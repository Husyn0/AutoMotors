<?php
// app/Http/Controllers/Api/ContentController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Service;
use App\Models\TruckType;
use App\Models\Project;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContentController extends Controller
{
    // Products
    public function getProducts()
    {
        return response()->json(
            Product::all()->map(fn($p)=>$p->toTranslatedArray())
            );
    }

    public function getProduct($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        return response()->json($product->toTranslatedArray());
    }

    public function createProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'price' => 'required|numeric|min:0',
            'short_description' => 'required|string',
            'translations.en.name' => 'sometimes|string|max:255',
            'translations.en.short_description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::create($request->all());
        return response()->json($product, 201);
    }

    public function updateProduct(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string|max:100',
            'price' => 'sometimes|required|numeric|min:0',
            'short_description' => 'sometimes|required|string',
            'translations.en.name' => 'sometimes|string|max:255',
            'translations.en.short_description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product->update($request->all());
        return response()->json($product);
    }

    public function deleteProduct($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }



    // Services
    public function getServices()
    {
        return response()->json(
            Service::all()->map(fn($p)=>$p->toTranslatedArray())
            );
    }

    public function getService($id)
    {
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }
        return response()->json($service->toTranslatedArray());
    }

    public function createService(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'translations.en.title' => 'sometimes|string|max:255',
            'translations.en.description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $service = Service::create($request->all());
        return response()->json($service, 201);
    }

    public function updateService(Request $request, $id)
    {
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'translations.en.title' => 'sometimes|string|max:255',
            'translations.en.description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $service->update($request->all());
        return response()->json($service);
    }

    public function deleteService($id)
    {
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }
        $service->delete();
        return response()->json(['message' => 'Service deleted']);
    }



    // Truck Types
    public function getTruckTypes()
    {
        return response()->json(
            TruckType::all()->map(fn($p)=>$p->toTranslatedArray())
            );
    }

    public function getTruckType($id)
    {
        $truckType = TruckType::find($id);
        if (!$truckType) {
            return response()->json(['error' => 'Truck type not found'], 404);
        }
        return response()->json($truckType->toTranslatedArray());
    }

    public function createTruckType(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'models' => 'required|string|max:255',
            'description' => 'required|string',
            'translations.en.name' => 'sometimes|string|max:255',
            'translations.en.description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $truckType = TruckType::create($request->all());
        return response()->json($truckType, 201);
    }

    public function updateTruckType(Request $request, $id)
    {
        $truckType = TruckType::find($id);
        if (!$truckType) {
            return response()->json(['error' => 'Truck type not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'models' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'translations.en.name' => 'sometimes|string|max:255',
            'translations.en.description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $truckType->update($request->all());
        return response()->json($truckType);
    }

    public function deleteTruckType($id)
    {
        $truckType = TruckType::find($id);
        if (!$truckType) {
            return response()->json(['error' => 'Truck type not found'], 404);
        }
        $truckType->delete();
        return response()->json(['message' => 'Truck type deleted']);
    }



    // Projects
    public function getProjects()
    {
        return response()->json(
            Project::all()->map(fn($p)=>$p->toTranslatedArray())
            );
    }

    public function getProject($id)
    {
        $project = Project::find($id);
        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }
        return response()->json($project->toTranslatedArray());
    }

    public function createProject(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'translations.en.title' => 'sometimes|string|max:255',
            'translations.en.description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project = Project::create($request->all());
        return response()->json($project, 201);
    }

    public function updateProject(Request $request, $id)
    {
        $project = Project::find($id);
        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'translations.en.title' => 'sometimes|string|max:255',
            'translations.en.description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project->update($request->all());
        return response()->json($project);
    }

    public function deleteProject($id)
    {
        $project = Project::find($id);
        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }
        $project->delete();
        return response()->json(['message' => 'Project deleted']);
    }




    // Settings
    public function getSettings()
    {
        $locale=app()->getLocale();
        $settings = Setting::all()->groupBy('group');
        $flatSettings = [];
        foreach ($settings as $group => $items) {
            foreach ($items as $item) {
                $key=$item->key;
                if($local==='en' && str_ends_with($key,'_en')){
                    $basekey=substr($key,0,-3);
                    $flatSettings[$basekey]=$item->value;
                }elseif(!str_ends_with($key,'_en')){
                    $flatSettings[$item->key] = $item->value;
                }
            }
        }
        return response()->json($flatSettings);
    }

    public function updateSettings(Request $request)
    {
        foreach ($request->all() as $key => $value) {
            Setting::set($key, $value);
        }
        return response()->json(['message' => 'Settings updated successfully']);
    }
}