<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        return response()->json(
            Category::withCount('products')
                ->get()
                ->map(fn ($c) => array_merge(
                    $c->toTranslatedArray(),
                    ['products_count' => $c->products_count]
                ))
        );
    }

    public function show($id)
    {
        $category = Category::with('products')->find($id);
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }
        return response()->json($category->toTranslatedArray());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'                          => 'required|string|max:255',
            'slug'                          => 'sometimes|string|max:255|unique:categories,slug',
            'icon'                          => 'sometimes|nullable|string|max:255',
            'image'                         => 'sometimes|nullable|string|max:255',
            'description'                   => 'sometimes|nullable|string',
            'translations.en.name'          => 'sometimes|string|max:255',
            'translations.en.description'   => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $category = Category::create($data);
        return response()->json($category->toTranslatedArray(), 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'                          => 'sometimes|required|string|max:255',
            'slug'                          => 'sometimes|string|max:255|unique:categories,slug,' . $id,
            'icon'                          => 'sometimes|nullable|string|max:255',
            'image'                         => 'sometimes|nullable|string|max:255',
            'description'                   => 'sometimes|nullable|string',
            'translations.en.name'          => 'sometimes|string|max:255',
            'translations.en.description'   => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();

        // Deep-merge translations
        if (isset($data['translations'])) {
            $existing = $category->translations ?? [];
            foreach ($data['translations'] as $locale => $fields) {
                $existing[$locale] = array_merge($existing[$locale] ?? [], $fields);
            }
            $data['translations'] = $existing;
        }

        $category->update($data);
        return response()->json($category->toTranslatedArray());
    }

    public function destroy($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return response()->json(['error' => 'Category not found'], 404);
        }

        // Optional: block deletion if products still reference it
        if ($category->products()->exists()) {
            return response()->json([
                'error' => 'Cannot delete category with existing products',
            ], 409);
        }

        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }
}