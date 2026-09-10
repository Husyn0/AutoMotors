<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TruckType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TruckTypeController extends Controller
{
    public function index()
    {
        return response()->json(
            TruckType::all()->map(fn ($t) => $t->toTranslatedArray())
        );
    }

    public function show($id)
    {
        $truckType = TruckType::find($id);
        if (!$truckType) {
            return response()->json(['error' => 'Truck type not found'], 404);
        }
        return response()->json($truckType->toTranslatedArray());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'        => 'required|string|max:255',
            'models'      => 'required|string|max:255',
            'description' => 'required|string',
            'translations.en.name'        => 'sometimes|string|max:255',
            'translations.en.description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $truckType = TruckType::create($request->all());
        return response()->json($truckType, 201);
    }

    public function update(Request $request, $id)
    {
        $truckType = TruckType::find($id);
        if (!$truckType) {
            return response()->json(['error' => 'Truck type not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'        => 'sometimes|required|string|max:255',
            'models'      => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'translations.en.name'        => 'sometimes|string|max:255',
            'translations.en.description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $truckType->update($request->all());
        return response()->json($truckType);
    }

    public function destroy($id)
    {
        $truckType = TruckType::find($id);
        if (!$truckType) {
            return response()->json(['error' => 'Truck type not found'], 404);
        }
        $truckType->delete();
        return response()->json(['message' => 'Truck type deleted']);
    }
}