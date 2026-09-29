<?php

namespace App\Observers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ImageObserver
{
    /**
     * Handle "deleted" — remove the file that was attached.
     */
    public function deleted(Model $model): void
    {
        $this->deleteIfOrphan($model, $model->getOriginal('image'));
    }

    /**
     * Handle "updated" — if the image column changed, delete the old one.
     */
    public function updated(Model $model): void
    {
        $column = 'image';

        if (! $model->isDirty($column)) {
            return;
        }

        $old = $model->getOriginal($column);
        $new = $model->getAttribute($column);

        if ($old && $old !== $new) {
            $this->deleteIfOrphan($model, $old);
        }
    }

    /**
     * Delete a file only if no other row in any tracked model references it.
     * Prevents deleting a shared image (e.g. same file used by two products).
     */
    protected function deleteIfOrphan(Model $model, ?string $path): void
    {
        if (! $this->isManagedPath($path)) {
            return;
        }

        if ($this->isReferencedElsewhere($path, $model)) {
            Log::info('[ImageObserver] file still referenced elsewhere, keeping', [
                'path'  => $path,
                'model' => get_class($model),
                'id'    => $model->getKey(),
            ]);
            return;
        }

        Storage::disk('public')->delete($path);

        Log::info('[ImageObserver] orphan file removed', [
            'path'  => $path,
            'model' => get_class($model),
            'id'    => $model->getKey(),
        ]);
    }

    /**
     * Same rule as HasImageUrl: skip URLs and legacy paths.
     */
    protected function isManagedPath(?string $path): bool
    {
        if (! $path) {
            return false;
        }

        if (
            str_starts_with($path, 'http://') ||
            str_starts_with($path, 'https://') ||
            str_starts_with($path, '//')      ||
            str_starts_with($path, '/')
        ) {
            return false;
        }

        return true;
    }

    /**
     * Check every tracked model for another row pointing at the same path.
     */
    protected function isReferencedElsewhere(string $path, Model $exclude): bool
    {
        foreach (config('images.tracked', []) as $modelClass => $column) {
            $query = $modelClass::query()->where($column, $path);

            // Don't count the row we're in the middle of deleting/updating
            if ($modelClass === get_class($exclude) && $exclude->exists) {
                $query->whereKeyNot($exclude->getKey());
            }

            if ($query->exists()) {
                return true;
            }
        }

        return false;
    }
}