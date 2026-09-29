<?php

namespace App\Services;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ImageReaper
{
    /**
     * @return array{scanned:int, deleted:int, skipped:int, missing:int, errors:array}
     */
    public function reap(bool $dryRun = false): array
    {
        $disk         = Storage::disk('public');
        $folders      = config('images.folders', []);
        $tracked      = config('images.tracked', []);
        $graceMinutes = (int) config('images.grace_minutes', 60);
        $cutoff       = Carbon::now()->subMinutes($graceMinutes)->getTimestamp();

        // 1. Gather every relative path currently referenced in the DB.
        $referenced = $this->collectReferencedPaths($tracked);

        $scanned = 0;
        $deleted = 0;
        $skipped = 0;
        $errors  = [];

        foreach ($folders as $folder) {
            if (! $disk->exists($folder)) {
                continue;
            }

            foreach ($disk->files($folder) as $relativePath) {
                $scanned++;

                // Skip anything already in the DB
                if (isset($referenced[$relativePath])) {
                    continue;
                }

                // Skip files younger than the grace window
                $mtime = $disk->lastModified($relativePath);
                if ($mtime > $cutoff) {
                    $skipped++;
                    continue;
                }

                // Skip anything outside the whitelisted folders (paranoia)
                if (! $this->isInsideAllowedFolder($relativePath, $folders)) {
                    continue;
                }

                try {
                    if (! $dryRun) {
                        $disk->delete($relativePath);
                    }
                    $deleted++;
                    Log::info('[ImageReaper] orphan removed', [
                        'path'   => $relativePath,
                        'dry'    => $dryRun,
                    ]);
                } catch (\Throwable $e) {
                    $errors[] = ['path' => $relativePath, 'error' => $e->getMessage()];
                    Log::warning('[ImageReaper] delete failed', [
                        'path'  => $relativePath,
                        'error' => $e->getMessage(),
                    ]);
                }
            }
        }

        // 2. Reverse pass — DB rows pointing at missing files (warning only).
        $missing = $this->findMissingFiles($referenced, $disk);

        return compact('scanned', 'deleted', 'skipped', 'missing', 'errors');
    }

    /**
     * Build a Set of every non-null, non-URL image path across tracked models.
     */
    protected function collectReferencedPaths(array $tracked): array
    {
        $referenced = [];

        foreach ($tracked as $modelClass => $column) {
            // Only pull the column, no other overhead
            $rows = $modelClass::query()
                ->whereNotNull($column)
                ->where($column, '!=', '')
                ->pluck($column);

            foreach ($rows as $value) {
                // Skip legacy paths and absolute URLs — they aren't ours to manage
                if (
                    str_starts_with($value, 'http://') ||
                    str_starts_with($value, 'https://') ||
                    str_starts_with($value, '//')      ||
                    str_starts_with($value, '/')
                ) {
                    continue;
                }
                $referenced[$value] = true;
            }
        }

        return $referenced;
    }

    /**
     * Returns rows whose image path points to a file that no longer exists.
     * These are NOT deleted — they're logged so you can repair them manually.
     */
    protected function findMissingFiles(array $referenced, $disk): array
    {
        $missing = [];

        foreach (array_keys($referenced) as $path) {
            if (! $disk->exists($path)) {
                $missing[] = $path;
            }
        }

        if (! empty($missing)) {
            Log::warning('[ImageReaper] DB rows reference missing files', [
                'count' => count($missing),
                'paths' => array_slice($missing, 0, 20), // cap log size
            ]);
        }

        return $missing;
    }

    protected function isInsideAllowedFolder(string $path, array $folders): bool
    {
        $top = explode('/', $path, 2)[0] ?? '';
        return in_array($top, $folders, true);
    }
}