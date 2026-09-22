<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // 1. Generic API bucket — every IP gets this ceiling
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(120)->by($request->ip());
        });

        // 2. Authenticated bucket — per user, higher ceiling
        RateLimiter::for('api-authed', function (Request $request) {
            return $request->user()
                ? Limit::perMinute(300)->by('u:'.$request->user()->id)
                : Limit::perMinute(30)->by('ip:'.$request->ip());
        });

        // 3. Expensive writes — small ceiling, longer window
        RateLimiter::for('api-writes', function (Request $request) {
            return Limit::perMinute(20)
                ->by($request->user()?->id ?? $request->ip())
                ->response(function (Request $request, array $headers) {
                    return response()->json([
                        'error' => 'Too many write requests.',
                        'retry_after_seconds' => $headers['Retry-After'] ?? null,
                    ], 429, $headers);
                });
        });

        // 4. File uploads — very small ceiling (they're expensive)
        RateLimiter::for('uploads', function (Request $request) {
            return Limit::perMinute(10)
                ->by($request->user()?->id ?? $request->ip())
                ->response(fn (Request $r, array $h) => response()->json([
                    'error' => 'Upload rate limit exceeded.',
                ], 429, $h));
        });

        // 5. Global safety net for unauthenticated hits on any /api route
        RateLimiter::for('api-anon', function (Request $request) {
            return Limit::perMinute(60)->by($request->ip());
        });

    }
}
