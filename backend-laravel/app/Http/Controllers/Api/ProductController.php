<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Api\Concerns\CachesResponses;

class ProductController extends Controller
{
    use CachesResponses;

    public function index()
    {
        $data = $this->rememberList('products', function () {
            return Product::all()
                ->map(fn ($p) => $p->toTranslatedArray())
                ->all();
        });

        return response()->json($data);
    }

    public function show($id)
    {
        $data = $this->rememberShow('products', $id, function () use ($id) {
            $product = Product::with('category')->find($id);
            return $product ? $product->toTranslatedArray() : null;
        });

        if (!$data) {
            return response()->json(['error' => 'Product not found'], 404);
        }

        return response()->json($data);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'              => 'required|string|max:255',
            'category_id'       => 'required|exists:categories,id',
            'price'             => 'required|numeric|min:0',
            'short_description' => 'required|string',
            'translations.en.name'              => 'sometimes|string|max:255',
            'translations.en.short_description' => 'sometimes|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $product = Product::create($request->all());
        $product->load('category');

        $this->invalidate('products');
        $this->invalidate('categories');

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
            'category_id'       => 'sometimes|required|exists:categories,id',
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
        $product->load('category');

        $this->invalidate('products');
        $this->invalidate('categories');

        return response()->json($product->toTranslatedArray());
    }

    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product) {
            return response()->json(['error' => 'Product not found'], 404);
        }
        $product->delete();

        $this->invalidate('products');
        $this->invalidate('categories');

        return response()->json(['message' => 'Product deleted']);
    }
}