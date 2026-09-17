<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::query();

        // Filter by ?type=srv or ?type=adv
        if ($type = $request->query('type')) {
            if (!in_array($type, Service::TYPES, true)) {
                return response()->json([
                    'error' => 'Invalid type',
                    'allowed' => Service::TYPES,
                ], 422);
            }
            $query->ofType($type);
        }

        return response()->json(
            $query->get()->map(fn ($s) => $s->toTranslatedArray())
        );
    }

    public function show($id)
    {
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }
        return response()->json($service->toTranslatedArray());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'       => 'required|string|max:255',
            'type'        => 'sometimes|in:srv,adv',
            'description' => 'required|string',
            'translations.en.title'       => 'sometimes|string|max:255',
            'translations.en.description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        $data['type'] = $data['type'] ?? 'srv';

        $service = Service::create($data);
        return response()->json($service->toTranslatedArray(), 201);
    }

    public function update(Request $request, $id)
    {
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title'       => 'sometimes|required|string|max:255',
            'type'        => 'sometimes|in:srv,adv',
            'description' => 'sometimes|required|string',
            'translations.en.title'       => 'sometimes|string|max:255',
            'translations.en.description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();

        if (isset($data['translations'])) {
            $existing = $service->translations ?? [];
            foreach ($data['translations'] as $locale => $fields) {
                $existing[$locale] = array_merge($existing[$locale] ?? [], $fields);
            }
            $data['translations'] = $existing;
        }

        $service->update($data);
        return response()->json($service->toTranslatedArray());
    }

    public function destroy($id)
    {
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }
        $service->delete();
        return response()->json(['message' => 'Service deleted']);
    }
}