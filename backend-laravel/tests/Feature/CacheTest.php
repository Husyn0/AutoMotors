<?php

namespace Tests\Feature;

use App\Models\AdminUser;
use App\Models\Category;
use App\Models\Product;
use App\Models\Service;
use App\Models\Setting;
use App\Support\CacheKeys;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class CacheTest extends TestCase
{
    use RefreshDatabase;

    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed a minimal admin
        $admin = AdminUser::create([
            'name'     => 'Admin',
            'email'    => 'admin@cache-test.local',
            'password' => bcrypt('password123'),
        ]);

        $this->token = auth('api')->login($admin);

        cache()->clear();
    }

    /** ---------- helpers ---------- */

    protected function authed(): static
    {
        return $this->withHeader('Authorization', 'Bearer ' . $this->token)
                    ->withHeader('Accept', 'application/json');
    }

    protected function cacheKeyExists(string $fragment): bool
    {
        return DB::table('cache')->pluck('key')
            ->contains(fn ($k) => str_contains($k, $fragment));
    }

    protected function cacheKeysLike(string $fragment): array
    {
        return DB::table('cache')->pluck('key')
            ->filter(fn ($k) => str_contains($k, $fragment))
            ->values()->all();
    }

    /** ---------- 0. Sanity ---------- */

    public function test_cache_store_is_not_array(): void
    {
        $this->assertNotInstanceOf(
            \Illuminate\Cache\ArrayStore::class,
            cache()->getStore()
        );
    }

    public function test_first_get_writes_a_list_key(): void
    {
        Category::factory()->create();          // need a category for products
        Product::create([
            'name' => 'p1', 'category_id' => Category::first()->id,
            'price' => 1, 'short_description' => 'x',
        ]);

        $this->getJson('/api/products')->assertOk();

        $keys = $this->cacheKeysLike('api:products');
        $this->assertNotEmpty($keys, 'expected at least one products cache key');

        $hasList = collect($keys)->contains(fn ($k) => str_contains($k, ':list:'));
        $this->assertTrue($hasList, 'expected a list key');
    }

    /** ---------- 2. Locale isolation ---------- */

    public function test_fr_and_en_use_separate_cache_buckets(): void
    {
        Category::factory()->create();

        $this->withHeader('Accept-Language', 'fr')->getJson('/api/products')->assertOk();
        $this->withHeader('Accept-Language', 'en')->getJson('/api/products')->assertOk();

        $keys = $this->cacheKeysLike('api:products:list');
        $hasFr = collect($keys)->contains(fn ($k) => str_ends_with($k, ':fr'));
        $hasEn = collect($keys)->contains(fn ($k) => str_ends_with($k, ':en'));

        $this->assertTrue($hasFr, 'expected a :fr list key');
        $this->assertTrue($hasEn, 'expected a :en list key');
    }

    /** ---------- 3. Version bump ---------- */

    public function test_write_bumps_version(): void
    {
        $before = CacheKeys::currentVersion('products');

        $cat = Category::factory()->create();
        $this->authed()->postJson('/api/products', [
            'name'              => 'v-probe',
            'category_id'       => $cat->id,
            'price'             => 1,
            'short_description' => 'x',
        ])->assertCreated();

        $after = CacheKeys::currentVersion('products');
        $this->assertSame($before + 1, $after);
    }

    public function test_old_versioned_key_remains_until_ttl(): void
    {
        $cat = Category::factory()->create();

        // Warm with the old version
        $this->getJson('/api/products')->assertOk();
        $oldKeys = $this->cacheKeysLike('api:products:list');
        $this->assertNotEmpty($oldKeys);

        // Bump
        $this->authed()->postJson('/api/products', [
            'name' => 'x', 'category_id' => $cat->id,
            'price' => 1, 'short_description' => 'x',
        ])->assertCreated();

        // Old key still present
        foreach ($oldKeys as $k) {
            $this->assertTrue(
                DB::table('cache')->where('key', $k)->exists(),
                "expected old key $k to still exist"
            );
        }
    }

    /** ---------- 4. Cross-resource ---------- */

    public function test_category_edit_bumps_products_version(): void
    {
        $cat = Category::factory()->create();
        $vPBefore = CacheKeys::currentVersion('products');
        $vCBefore = CacheKeys::currentVersion('categories');

        $this->authed()->putJson("/api/categories/{$cat->id}", ['icon' => '🔋'])
            ->assertOk();

        $this->assertSame($vPBefore + 1, CacheKeys::currentVersion('products'));
        $this->assertSame($vCBefore + 1, CacheKeys::currentVersion('categories'));
    }

    public function test_product_write_bumps_categories_version(): void
    {
        $cat = Category::factory()->create();
        $before = CacheKeys::currentVersion('categories');

        $this->authed()->postJson('/api/products', [
            'name' => 'x', 'category_id' => $cat->id,
            'price' => 1, 'short_description' => 'x',
        ])->assertCreated();

        $this->assertSame($before + 1, CacheKeys::currentVersion('categories'));
    }

    public function test_service_write_does_not_touch_products_version(): void
    {
        $before = CacheKeys::currentVersion('products');

        $this->authed()->postJson('/api/services', [
            'title' => 'iso', 'type' => 'srv', 'description' => 'x',
        ])->assertCreated();

        $this->assertSame($before, CacheKeys::currentVersion('products'));
    }

    /** ---------- 5. Show isolation ---------- */

    public function test_truck_types_and_projects_have_distinct_show_keys(): void
    {
        // Assumes seeders created ids 1..N in both tables. If not, create rows.
        \App\Models\TruckType::create([
            'name' => 'tt', 'models' => 'm', 'description' => 'd',
        ]);
        \App\Models\Project::create([
            'title' => 'p', 'description' => 'd',
        ]);

        $ttId = \App\Models\TruckType::first()->id;
        $prId = \App\Models\Project::first()->id;

        $this->getJson("/api/truck-types/{$ttId}")->assertOk();
        $this->getJson("/api/projects/{$prId}")->assertOk();

        $ttKeys = $this->cacheKeysLike('api:truck_types:show');
        $prKeys = $this->cacheKeysLike('api:projects:show');

        $this->assertNotEmpty($ttKeys, 'expected truck_types show key');
        $this->assertNotEmpty($prKeys, 'expected projects show key');
        $this->assertEmpty(
            array_intersect($ttKeys, $prKeys),
            'truck_types and projects share a cache key — collision!'
        );
    }

    /** ---------- 10. TTL ---------- */

    public function test_list_keys_have_5_minute_ttl(): void
    {
        Category::factory()->create();
        $this->getJson('/api/products')->assertOk();

        $row = DB::table('cache')
            ->where('key', 'like', '%api:products:list:%')
            ->first();

        $this->assertNotNull($row, 'expected a products list cache row');
        $ttl = $row->expiration - time();
        $this->assertGreaterThan(280, $ttl, "TTL too low: $ttl");
        $this->assertLessThanOrEqual(300, $ttl, "TTL too high: $ttl");
    }

    public function test_settings_have_1_hour_ttl(): void
    {
        $this->getJson('/api/settings')->assertOk();

        $row = DB::table('cache')
            ->where('key', 'like', '%api:settings:%')
            ->first();

        $this->assertNotNull($row, 'expected a settings cache row');
        $ttl = $row->expiration - time();
        $this->assertGreaterThan(3500, $ttl);
        $this->assertLessThanOrEqual(3600, $ttl);
    }

    /** ---------- 11. Negative caching ---------- */

    public function test_missing_show_is_not_cached(): void
    {
        $this->getJson('/api/products/999999')->assertNotFound();
        $this->assertFalse(
            $this->cacheKeyExists('api:products:show:999999'),
            'missing product must not be cached'
        );
    }

    /** ---------- 13. Failure recovery ---------- */

    public function test_corrupt_version_value_does_not_break_reads(): void
    {
        Category::factory()->create();
        cache()->forever('api:products:version', 'not-an-int');

        $this->getJson('/api/products')->assertOk();
    }

    public function test_cache_clear_empties_the_store(): void
    {
        Category::factory()->create();
        $this->getJson('/api/products')->assertOk();
        $this->assertGreaterThan(0, DB::table('cache')->count());

        cache()->clear();

        // cache()->clear() may leave the rate limiter keys in some setups — but
        // the api:* keys specifically must be gone.
        $this->assertEmpty($this->cacheKeysLike('api:products'));
    }

    /** ---------- 8. Service filter ---------- */

    public function test_service_write_bumps_one_version_covering_all_buckets(): void
    {
        // Warm all three buckets
        $this->getJson('/api/services')->assertOk();
        $this->getJson('/api/services?type=srv')->assertOk();
        $this->getJson('/api/services?type=adv')->assertOk();

        $before = CacheKeys::currentVersion('services');

        $this->authed()->postJson('/api/services', [
            'title' => 'bust', 'type' => 'srv', 'description' => 'x',
        ])->assertCreated();

        $this->assertSame($before + 1, CacheKeys::currentVersion('services'));
    }

    public function test_invalid_service_type_creates_no_cache_key(): void
    {
        $this->getJson('/api/services?type=bogus')->assertStatus(422);
        $this->assertFalse(
            $this->cacheKeyExists('services:list:bogus'),
            'invalid filter must not create a cache key'
        );
    }
}