<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class UploadController extends Controller
{
    /**
     * Whitelisted sub-folders so a user cannot traverse into arbitrary paths.
     */
    public const ALLOWED_FOLDERS = [
        'products',
        'categories',
        'services',
        'truck-types',
        'projects',
        'settings',
    ];

    /**
     * Max upload size in kilobytes (10 MB).
     */
    public const MAX_KB = 10240;

    /**
     * POST /api/uploads/{folder}
     * multipart/form-data with `file` field.
     */
    public function store(Request $request, string $folder)
    {
        if (!in_array($folder, self::ALLOWED_FOLDERS, true)) {
            return response()->json([
                'error'   => 'Invalid upload folder',
                'allowed' => self::ALLOWED_FOLDERS,
            ], 422);
        }

        $validator = Validator::make($request->all(), [
            'file' => [
                'required',
                'file',
                'max:' . self::MAX_KB,
                'mimes:jpg,jpeg,png,webp,gif,svg,pdf,doc,docx',
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $file = $request->file('file');

        // Generate a safe, unique filename. Keep original extension.
        $ext      = strtolower($file->getClientOriginalExtension() ?: $file->guessExtension());
        $basename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $name     = $basename . '-' . Str::random(8) . '.' . $ext;

        // Store inside storage/app/public/{folder}
        $path = $file->storeAs($folder, $name, 'public');

        return response()->json([
            'path' => $path,                                 // e.g. "products/battery-abc12345.jpg"
            'name' => $name,
            'url'  => Storage::disk('public')->url($path),   // e.g. "http://host/storage/products/..."
            'size' => $file->getSize(),
            'mime' => $file->getClientMimeType(),
        ], 201);
    }

    /**
     * DELETE /api/uploads/{folder}/{file}
     */
    public function destroy(string $folder, string $file)
    {
        if (!in_array($folder, self::ALLOWED_FOLDERS, true)) {
            return response()->json(['error' => 'Invalid upload folder'], 422);
        }

        // Prevent traversal (../)
        $file = basename($file);
        $path = "{$folder}/{$file}";

        if (!Storage::disk('public')->exists($path)) {
            return response()->json(['error' => 'File not found'], 404);
        }

        Storage::disk('public')->delete($path);

        return response()->json(['message' => 'File deleted', 'path' => $path]);
    }

    /**
     * GET /api/files/{folder}/{file}
     * Streams the file from the public disk. Useful if symlink isn't available
     * or you later want to gate access.
     */
    public function show(string $folder, string $file): StreamedResponse
    {
        abort_unless(in_array($folder, self::ALLOWED_FOLDERS, true), 404);

        $file = basename($file);
        $path = "{$folder}/{$file}";

        abort_unless(Storage::disk('public')->exists($path), 404);

        return Storage::disk('public')->response($path);
    }
}