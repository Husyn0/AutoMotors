<?php

namespace App\Traits;

use Illuminate\Support\Facades\Storage;

trait HasImageUrl
{
    /**
     * Columns that hold a public-disk relative path and should be exposed
     * with a `_url` companion. Override in the model if needed.
     */
    protected function imageColumns(): array
    {
        return ['image'];
    }

    /**
     * Build a public URL for a stored path.
     * - Absolute URLs (http://, https://, //) are returned untouched
     * - Paths starting with "/" are treated as already public (legacy seeds)
     * - Everything else is resolved against the "public" disk
     */
    public function imageUrlFor(?string $value): ?string
    {
        if (!$value) {
            return null;
        }

        if (str_starts_with($value, 'http://')
            || str_starts_with($value, 'https://')
            || str_starts_with($value, '//')
            || str_starts_with($value, '/')) {
            return $value;
        }

        return Storage::disk('public')->url($value);
    }
}