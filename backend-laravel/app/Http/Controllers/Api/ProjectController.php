<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Api\Concerns\CachesResponses;

class ProjectController extends Controller
{
    use CachesResponses;

    public function index()
    {
        $data = $this->rememberList('projects', function () {
            return Project::all()
                ->map(fn ($p) => $p->toTranslatedArray())
                ->all();
        });

        return response()->json($data);
    }

    public function show($id)
    {
        $data = $this->rememberShow('projects', $id, function () use ($id) {
            $project = Project::find($id);
            return $project ? $project->toTranslatedArray() : null;
        });

        if (!$data) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        return response()->json($data);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title'                       => 'required|string|max:255',
            'description'                 => 'required|string',
            'translations.en.title'       => 'sometimes|string|max:255',
            'translations.en.description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project = Project::create($request->all());

        $this->invalidate('projects');

        return response()->json($project->toTranslatedArray(), 201);
    }

    public function update(Request $request, $id)
    {
        $project = Project::find($id);
        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'title'                       => 'sometimes|required|string|max:255',
            'description'                 => 'sometimes|required|string',
            'translations.en.title'       => 'sometimes|string|max:255',
            'translations.en.description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();

        // Deep-merge translations so partial updates don't wipe other keys
        if (isset($data['translations'])) {
            $existing = $project->translations ?? [];
            foreach ($data['translations'] as $locale => $fields) {
                $existing[$locale] = array_merge($existing[$locale] ?? [], $fields);
            }
            $data['translations'] = $existing;
        }

        // Was $request->all() — this dropped the merged translations
        $project->update($data);

        $this->invalidate('projects');

        return response()->json($project->toTranslatedArray());
    }

    public function destroy($id)
    {
        $project = Project::find($id);
        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }
        $project->delete();

        $this->invalidate('projects');

        return response()->json(['message' => 'Project deleted']);
    }
}