<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->header('Accept-Language')
            ?? $request->query('lang')
            ?? config('app.fallback_locale', 'fr');

        // Normalize (e.g., "en-US,en;q=0.9" → "en")
        $locale = substr($locale, 0, 2);

        if (in_array($locale, ['fr', 'en'])) {
            App::setLocale($locale);
        }

        return $next($request);
    }
}