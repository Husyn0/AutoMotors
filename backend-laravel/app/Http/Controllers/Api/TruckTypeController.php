<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TruckType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Api\Concerns\CachesResponses;

class TruckTypeController extends Controller
{
    use CachesResponses;

    public function index()
    {
        $data = $this->rememberList('truck_types', function () {
            return TruckType::all()
                ->map(fn ($t) => $t->toTranslatedArray())
                ->all();
        });

        return response()->json($data);
    }

    public function show($id)
    {
        // Was 'projects' by mistake — collides with ProjectController's cache
        $data = $this->rememberShow('truck_types', $id, function () use ($id) {
            $truckType = TruckType::find($id);
            return $truckType ? $truckType->toTranslatedArray() : null;
        });

        if (!$data) {
            return response()->json(['error' => 'Truck type not found'], 404);
        }

        return response()->json($data);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'                        => 'required|string|max:255',
            'models'                      => 'required|string|max:255',
            'description'                 => 'required|string',
            'translations.en.name'        => 'sometimes|string|max:255',
            'translations.en.description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $truckType = TruckType::create($request->all());

        $this->invalidate('truck_types');

        return response()->json($truckType->toTranslatedArray(), 201);
    }

    public function update(Request $request, $id)
    {
        $truckType = TruckType::find($id);
        if (!$truckType) {
            return response()->json(['error' => 'Truck type not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'                        => 'sometimes|required|string|max:255',
            'models'                      => 'sometimes|required|string|max:255',
            'description'                 => 'sometimes|required|string',
            'translations.en.name'        => 'sometimes|string|max:255',
            'translations.en.description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();

        // Deep-merge translations so partial updates don't wipe other keys
        if (isset($data['translations'])) {
            $existing = $truckType->translations ?? [];
            foreach ($data['translations'] as $locale => $fields) {
                $existing[$locale] = array_merge($existing[$locale] ?? [], $fields);
            }
            $data['translations'] = $existing;
        }

        // Was $request->all() — this dropped the merged translations
        $truckType->update($data);

        $this->invalidate('truck_types');

        return response()->json($truckType->toTranslatedArray());
    }

    public function destroy($id)
    {
        $truckType = TruckType::find($id);
        if (!$truckType) {
            return response()->json(['error' => 'Truck type not found'], 404);
        }
        $truckType->delete();

        $this->invalidate('truck_types');

        return response()->json(['message' => 'Truck type deleted']);
    }
}