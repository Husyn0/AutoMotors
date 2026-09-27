<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Api\Concerns\CachesResponses;

class ServiceController extends Controller
{
    use CachesResponses;

    public function index(Request $request)
    {
        // Default to 'all' so a bare GET /api/services works
        $type = $request->query('type', 'all');

        if ($type !== 'all' && !in_array($type, Service::TYPES, true)) {
            return response()->json([
                'error'   => 'Invalid type',
                'allowed' => Service::TYPES,
            ], 422);
        }

        // Fold the filter into the resource name so each filter has its own bucket
        $data = $this->rememberList("services:{$type}", function () use ($type) {
            $query = Service::query();
            if ($type !== 'all') {
                $query->ofType($type);
            }
            return $query->get()->map(fn ($s) => $s->toTranslatedArray())->all();
        });

        return response()->json($data);
    }

    public function show($id)
    {
        $data = $this->rememberShow('services', $id, function () use ($id) {
            $service = Service::find($id);
            return $service ? $service->toTranslatedArray() : null;
        });

        if (!$data) {
            return response()->json(['error' => 'Service not found'], 404);
        }

        return response()->json($data);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'                       => 'required|string|max:255',
            'type'                        => 'sometimes|in:srv,adv',
            'description'                 => 'required|string',
            'translations.en.title'       => 'sometimes|string|max:255',
            'translations.en.description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        $data['type'] = $data['type'] ?? 'srv';

        $service = Service::create($data);

        $this->invalidate('services');

        return response()->json($service->toTranslatedArray(), 201);
    }

    public function update(Request $request, $id)
    {
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title'                       => 'sometimes|required|string|max:255',
            'type'                        => 'sometimes|in:srv,adv',
            'description'                 => 'sometimes|required|string',
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

        $this->invalidate('services');

        return response()->json($service->toTranslatedArray());
    }

    public function destroy($id)
    {
        $service = Service::find($id);
        if (!$service) {
            return response()->json(['error' => 'Service not found'], 404);
        }
        $service->delete();

        $this->invalidate('services');

        return response()->json(['message' => 'Service deleted']);
    }
}