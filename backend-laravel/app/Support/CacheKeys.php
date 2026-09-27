<?php

namespace App\Support;

class CacheKeys
{
    /** TTLs in seconds */
    public const TTL_LIST     = 300;   // 5 min  — index endpoints
    public const TTL_SHOW     = 600;   // 10 min — single-resource endpoints
    public const TTL_SETTINGS = 3600;  // 1 hour — rarely changes

    public static function list(string $resource, string $locale): string
    {
        return sprintf('api:%s:list:%s', $resource, $locale);
    }

    public static function show(string $resource, int|string $id, string $locale): string
    {
        return sprintf('api:%s:show:%s:%s', $resource, $id, $locale);
    }

    public static function settings(string $locale): string
    {
        return sprintf('api:settings:%s', $locale);
    }

    /**
     * Version-stamp key: bump this to nuke an entire resource's cache
     * without iterating keys. Pattern borrowed from "cache versioning".
     */
    public static function version(string $resource): string
    {
        return sprintf('api:%s:version', $resource);
    }

    public static function currentVersion(string $resource): int
    {
        return (int) cache()->get(self::version($resource), 1);
    }

    public static function bumpVersion(string $resource): void
    {
        // forever() is intentional — if this key expired, the counter would
        // reset to 1 and previously-stale keys would match again.
        cache()->forever(self::version($resource), self::currentVersion($resource) + 1);
    }

    /**
     * Versioned key builders. Any key emitted by these is automatically
     * stale after a bump — the version prefix changes.
     */
    public static function vList(string $resource, string $locale): string
    {
        $v = self::currentVersion($resource);
        return $v . ':' . self::list($resource, $locale);
    }

    public static function vShow(string $resource, int|string $id, string $locale): string
    {
        $v = self::currentVersion($resource);
        return $v . ':' . self::show($resource, $id, $locale);
    }
}