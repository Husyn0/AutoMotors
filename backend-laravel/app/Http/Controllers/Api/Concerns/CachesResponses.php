<?php

namespace App\Http\Controllers\Api\Concerns;

use App\Support\CacheKeys;
use Illuminate\Support\Facades\App;

trait CachesResponses
{
    /**
     * Cache a JSON-serializable payload for a list endpoint.
     */
    protected function rememberList(string $resource, callable $callback)
    {
        $locale = App::getLocale();
        $key    = CacheKeys::vList($resource, $locale);

        return cache()->remember($key, CacheKeys::TTL_LIST, $callback);
    }

    /**
     * Cache a JSON-serializable payload for a show endpoint.
     */
    protected function rememberShow(string $resource, int|string $id, callable $callback)
    {
        $locale = App::getLocale();
        $key    = CacheKeys::vShow($resource, $id, $locale);

        return cache()->remember($key, CacheKeys::TTL_SHOW, $callback);
    }

    /**
     * Invalidate an entire resource (list + all shows) with one bump.
     */
    protected function invalidate(string $resource): void
    {
        CacheKeys::bumpVersion($resource);
    }
}