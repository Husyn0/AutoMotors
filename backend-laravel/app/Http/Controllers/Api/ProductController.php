<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(
            Product::all()->map(fn ($p) => $p->toTranslatedArray())
        );
    }

    public function show($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        return response()->json($product->toTranslatedArray());
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'              => 'required|string|max:255',
            'category'          => 'required|string|max:100',
            'price'             => 'required|numeric|min:0',
            'short_description' => 'required|string',
            'translations.en.name'              => 'sometimes|string|max:255',
            'translations.en.short_description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::create($request->all());
        return response()->json($product->toTranslatedArray(), 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name'              => 'sometimes|required|string|max:255',
            'category'          => 'sometimes|required|string|max:100',
            'price'             => 'sometimes|required|numeric|min:0',
            'short_description' => 'sometimes|required|string',
            'translations.en.name'              => 'sometimes|string|max:255',
            'translations.en.short_description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();

        // Deep-merge translations so partial updates don't wipe other keys
        if (isset($data['translations'])) {
            $existing = $product->translations ?? [];
            foreach ($data['translations'] as $locale => $fields) {
                $existing[$locale] = array_merge($existing[$locale] ?? [], $fields);
            }
            $data['translations'] = $existing;
        }

        $product->update($data);
        return response()->json($product->toTranslatedArray());
    }

    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        $product->delete();
        return response()->json(['message' => 'Product deleted']);
    }
}