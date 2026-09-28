# Verify the cache is actually being used
## Quick smoke test after wiring products:
```bash 
php artisan cache:clear

# 1st hit — slow-ish, populates cache
curl -s -o /dev/null -w "1st:  %{time_total}s\n" \
  http://127.0.0.1:8000/api/products

# 2nd hit — should be noticeably faster
curl -s -o /dev/null -w "2nd: %{time_total}s\n" \
  http://127.0.0.1:8000/api/products

# 3rd hit — should be noticeably faster
curl -s -o /dev/null -w "3rd: %{time_total}s\n" \
  http://127.0.0.1:8000/api/products

# 4th hit — should be noticeably faster
curl -s -o /dev/null -w "4th: %{time_total}s\n" \
  http://127.0.0.1:8000/api/products

# 5th hit — should be noticeably faster
curl -s -o /dev/null -w "5th: %{time_total}s\n" \
  http://127.0.0.1:8000/api/products

```

# 0. Setup
## 0.1 Export base URL and confirm cache store
```bash

BASE="http://127.0.0.1:8000/api"

php artisan tinker --execute="echo get_class(cache()->store()) . PHP_EOL;"
# expected: Illuminate\Cache\DatabaseStore  (or FileStore/RedisStore — NOT ArrayStore)
```
## 0.2 Login and store a fresh token
```bash

TOKEN=$(curl -s -X POST $BASE/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@automotors.com","password":"password123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

[ -z "$TOKEN" ] && { echo "FATAL: no token — login failed or throttled"; exit 1; }
echo "TOKEN=${TOKEN:0:24}..."
```
## 0.3 Helper — list cache keys matching a fragment
```bash

cache_keys() {
  php artisan tinker --execute="
    \$rows = DB::table('cache')->pluck('key');
    foreach (\$rows->filter(fn(\$k) => str_contains(\$k, '$1')) as \$k) {
      echo \$k, PHP_EOL;
    }
  "
}
```
## 0.4 Helper — reset everything before a scenario
```bash

reset_all() {
  php artisan cache:clear > /dev/null
  echo "cache cleared"
}
```
# 1. Sanity — cache is actually being written
## 1.1 One GET /products should create cache entries
```bash

reset_all

curl -s -o /dev/null "$BASE/products" -H "Accept: application/json"

cache_keys "api:products"
# expected: a version key AND a versioned list key, e.g.
#   1:api:products:list:fr
#   api:products:version
```
## 1.2 Second call should be faster (cache hit)
```bash

reset_all

curl -s -o /dev/null -w "first:  %{time_total}s\n" \
  "$BASE/products" -H "Accept: application/json"

curl -s -o /dev/null -w "second: %{time_total}s\n" \
  "$BASE/products" -H "Accept: application/json"

curl -s -o /dev/null -w "third:  %{time_total}s\n" \
  "$BASE/products" -H "Accept: application/json"
# expected: second/third noticeably faster than first
```
1.3 Response body is identical on cache hit
```bash

reset_all

A=$(curl -s "$BASE/products" -H "Accept: application/json" | sha256sum | cut -d' ' -f1)
B=$(curl -s "$BASE/products" -H "Accept: application/json" | sha256sum | cut -d' ' -f1)
C=$(curl -s "$BASE/products" -H "Accept: application/json" | sha256sum | cut -d' ' -f1)

echo "A=$A"
echo "B=$B"
echo "C=$C"
# expected: all three hashes identical
```
# 2. Locale isolation
## 2.1 FR and EN lists must use different keys
```bash

reset_all

curl -s -o /dev/null "$BASE/products" -H "Accept-Language: fr" -H "Accept: application/json"
curl -s -o /dev/null "$BASE/products" -H "Accept-Language: en" -H "Accept: application/json"

cache_keys "api:products:list"
# expected: two keys, one ending in :fr and one in :en
```
## 2.2 FR and EN responses must differ (when translations exist)
```bash

FR=$(curl -s "$BASE/products" -H "Accept-Language: fr" -H "Accept: application/json")
EN=$(curl -s "$BASE/products" -H "Accept-Language: en" -H "Accept: application/json")

if [ "$FR" = "$EN" ]; then
  echo "WARN: FR and EN are identical — either no translations exist, or locale is being ignored"
else
  echo "OK: FR and EN differ"
fi
```
## 2.3 ?lang=en matches the Accept-Language: en cache entry
```bash

reset_all

# Seed FR and EN via header
curl -s -o /dev/null "$BASE/products" -H "Accept-Language: fr" -H "Accept: application/json"
curl -s -o /dev/null "$BASE/products" -H "Accept-Language: en" -H "Accept: application/json"

COUNT_BEFORE=$(cache_keys "api:products:list" | wc -l)

# Now hit with ?lang=en — should hit the EN bucket, not create a new one
curl -s -o /dev/null "$BASE/products?lang=en" -H "Accept: application/json"

COUNT_AFTER=$(cache_keys "api:products:list" | wc -l)

echo "before=$COUNT_BEFORE after=$COUNT_AFTER"
# expected: counts equal (no new key created)
```
# 3. Version-stamp invalidation
## 3.1 A write must change the version number

```bash

reset_all

# Warm the list cache
curl -s -o /dev/null "$BASE/products" -H "Accept: application/json"

V_BEFORE=$(php artisan tinker --execute="echo \App\Support\CacheKeys::currentVersion('products');")
echo "version before write: $V_BEFORE"

# Perform a write (creates a new product)
curl -s -o /dev/null -X POST "$BASE/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Cache Probe Product",
    "category_id": 1,
    "price": 1.23,
    "short_description": "cache test"
  }'

V_AFTER=$(php artisan tinker --execute="echo \App\Support\CacheKeys::currentVersion('products');")
echo "version after write:  $V_AFTER"
# expected: V_AFTER = V_BEFORE + 1
```
## 3.2 Old versioned key must still be present but unused
```bash

cache_keys "api:products"
# expected: BOTH the old version prefix (e.g. "1:...") and the new one ("2:...")
# The old one is orphaned but harmless — it will expire via TTL.
```
## 3.3 Post-write GET must return fresh data
```bash

reset_all

# Seed cache
curl -s -o /dev/null "$BASE/products" -H "Accept: application/json"
BEFORE=$(curl -s "$BASE/products" -H "Accept: application/json" | grep -c "Cache Probe Product")

# Write a fresh probe
STAMP="probe-$(date +%s)"
curl -s -o /dev/null -X POST "$BASE/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"name\": \"$STAMP\",
    \"category_id\": 1,
    \"price\": 1.23,
    \"short_description\": \"cache test\"
  }"

# Immediate GET must see the new row
AFTER=$(curl -s "$BASE/products" -H "Accept: application/json" | grep -c "$STAMP")

echo "before=$BEFORE after=$AFTER"
# expected: after >= 1  (the freshly-created product appears in the list)
```
## 3.4 Update must invalidate
```bash

reset_all

PID=$(curl -s "$BASE/products" -H "Accept: application/json" \
  | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
echo "PID=$PID"

# Warm cache
curl -s -o /dev/null "$BASE/products" -H "Accept: application/json"

# Update price
curl -s -o /dev/null -X PUT "$BASE/products/$PID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"price": 42.42}'

# The next GET must reflect the new price
curl -s "$BASE/products/$PID" -H "Accept: application/json" | grep -o '"price":"[^"]*"'
# expected: "price":"42.42"
```
## 3.5 Destroy must invalidate
```bash

reset_all

# Create a throwaway product
STAMP="del-probe-$(date +%s)"
PID=$(curl -s -X POST "$BASE/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"name\":\"$STAMP\",\"category_id\":1,\"price\":1.00,\"short_description\":\"x\"}" \
  | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
echo "PID=$PID"

# Warm the list, confirm it's there
curl -s "$BASE/products" -H "Accept: application/json" | grep -c "$STAMP"

# Delete
curl -s -o /dev/null -X DELETE "$BASE/products/$PID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"

# Next list must NOT contain it
curl -s "$BASE/products" -H "Accept: application/json" | grep -c "$STAMP"
# expected: 0
```

# 4. Cross-resource invalidation

Products embed their category, so editing a category must also bust the products cache.
## 4.1 Editing a category must invalidate products
```bash

reset_all

V_P_BEFORE=$(php artisan tinker --execute="echo \App\Support\CacheKeys::currentVersion('products');")
V_C_BEFORE=$(php artisan tinker --execute="echo \App\Support\CacheKeys::currentVersion('categories');")

curl -s -o /dev/null -X PUT "$BASE/categories/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"icon": "🔋"}'

V_P_AFTER=$(php artisan tinker --execute="echo \App\Support\CacheKeys::currentVersion('products');")
V_C_AFTER=$(php artisan tinker --execute="echo \App\Support\CacheKeys::currentVersion('categories');")

echo "products:   $V_P_BEFORE -> $V_P_AFTER"
echo "categories: $V_C_BEFORE -> $V_C_AFTER"
# expected: BOTH bumped
```
## 4.2 Editing a product must invalidate categories (products_count changes)
```bash

reset_all

V_C_BEFORE=$(php artisan tinker --execute="echo \App\Support\CacheKeys::currentVersion('categories');")

curl -s -o /dev/null -X POST "$BASE/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name":"cat-count-probe","category_id":1,"price":1.00,"short_description":"x"}'

V_C_AFTER=$(php artisan tinker --execute="echo \App\Support\CacheKeys::currentVersion('categories');")

echo "categories: $V_C_BEFORE -> $V_C_AFTER"
# expected: bumped
```
## 4.3 Editing a service must NOT touch products
```bash

reset_all

V_P_BEFORE=$(php artisan tinker --execute="echo \App\Support\CacheKeys::currentVersion('products');")

curl -s -o /dev/null -X POST "$BASE/services" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"title":"isolation-probe","type":"srv","description":"x"}'

V_P_AFTER=$(php artisan tinker --execute="echo \App\Support\CacheKeys::currentVersion('products');")

echo "products: $V_P_BEFORE -> $V_P_AFTER"
# expected: unchanged
```
# 5. Show-endpoint isolation
## 5.1 Different IDs produce different cache entries
```bash

reset_all

curl -s -o /dev/null "$BASE/products/2" -H "Accept: application/json"
curl -s -o /dev/null "$BASE/products/3" -H "Accept: application/json"
curl -s -o /dev/null "$BASE/products/4" -H "Accept: application/json"

cache_keys "api:products:show"
# expected: three distinct keys, one per id, each ending in :fr (or your default locale)
```
## 5.2 Truck-type show does not collide with project show
```bash

reset_all

curl -s -o /dev/null "$BASE/truck-types/2" -H "Accept: application/json"
curl -s -o /dev/null "$BASE/projects/2"     -H "Accept: application/json"

cache_keys "api:truck_types:show"
cache_keys "api:projects:show"
# expected: truck_types has its own key; projects has its own key.
# Neither response should leak into the other.
```
## 5.3 Body for /truck-types/2 must not look like a project
```bash

reset_all

BODY=$(curl -s "$BASE/truck-types/2" -H "Accept: application/json")

echo "$BODY" | grep -q '"models"'   && echo "OK: truck-type shape" || echo "FAIL: not a truck-type"
echo "$BODY" | grep -q '"title"'    && echo "FAIL: leaked project shape" || echo "OK: no project fields"
```
# 6. List vs show isolation

## 6.1 List and show use separate cache entries
```bash

reset_all

curl -s -o /dev/null "$BASE/products"   -H "Accept: application/json"
curl -s -o /dev/null "$BASE/products/2" -H "Accept: application/json"

cache_keys "api:products"
# expected:
#   api:products:version
#   <v>:api:products:list:fr
#   <v>:api:products:show:2:fr
```
## 6.2 Editing product 2 must invalidate BOTH its show and the list
```bash

reset_all

curl -s -o /dev/null "$BASE/products"   -H "Accept: application/json"
curl -s -o /dev/null "$BASE/products/2" -H "Accept: application/json"

curl -s -o /dev/null -X PUT "$BASE/products/2" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"price": 88.88}'

# Both should now read fresh from DB
curl -s "$BASE/products/2" -H "Accept: application/json" | grep -o '"price":"[^"]*"'
# expected: "price":"88.88"
```
# 7. Settings cache
## 7.1 Index is cached per locale
```bash

reset_all

curl -s -o /dev/null "$BASE/settings" -H "Accept-Language: fr" -H "Accept: application/json"
curl -s -o /dev/null "$BASE/settings" -H "Accept-Language: en" -H "Accept: application/json"

cache_keys "api:settings"
# expected: api:settings:fr AND api:settings:en
```
## 7.2 Updating settings busts both locales
```bash

reset_all

curl -s -o /dev/null "$BASE/settings" -H "Accept-Language: fr" -H "Accept: application/json"
curl -s -o /dev/null "$BASE/settings" -H "Accept-Language: en" -H "Accept: application/json"

BEFORE=$(cache_keys "api:settings" | wc -l)
echo "keys before update: $BEFORE"

curl -s -o /dev/null -X PUT "$BASE/settings" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"company_name":"AUTOMOTORS CI"}'

AFTER=$(cache_keys "api:settings" | wc -l)
echo "keys after update: $AFTER"
# expected: AFTER = 0 (both forgotten)
```
## 7.3 Fresh GET after update reflects new value
```bash

reset_all

curl -s -o /dev/null "$BASE/settings" -H "Accept: application/json"

curl -s -o /dev/null -X PUT "$BASE/settings" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"company_name":"CACHE-TEST-CO"}'

curl -s "$BASE/settings" -H "Accept: application/json" | grep -o '"company_name":"[^"]*"'
# expected: "company_name":"CACHE-TEST-CO"
```
# 8. Service filter isolation
## 8.1 ?type=srv, ?type=adv, and no filter use distinct keys
```bash

reset_all

curl -s -o /dev/null "$BASE/services"            -H "Accept: application/json"
curl -s -o /dev/null "$BASE/services?type=srv"   -H "Accept: application/json"
curl -s -o /dev/null "$BASE/services?type=adv"   -H "Accept: application/json"

cache_keys "api:services"
# expected: three list keys — services:all, services:srv, services:adv — plus the version key
```
8.2 The "all" and "srv" payloads differ
```bash

ALL=$(curl -s "$BASE/services"          -H "Accept: application/json")
SRV=$(curl -s "$BASE/services?type=srv" -H "Accept: application/json")

[ "$ALL" = "$SRV" ] && echo "WARN: all == srv" || echo "OK: filter is applied"

# sanity — srv list must not contain any adv rows
echo "$SRV" | grep -o '"type":"[^"]*"' | sort -u
# expected: only "type":"srv"
```
## 8.3 A write to a service busts every filter bucket
```bash

reset_all

curl -s -o /dev/null "$BASE/services"          -H "Accept: application/json"
curl -s -o /dev/null "$BASE/services?type=srv" -H "Accept: application/json"
curl -s -o /dev/null "$BASE/services?type=adv" -H "Accept: application/json"

V_BEFORE=$(php artisan tinker --execute="echo \App\Support\CacheKeys::currentVersion('services');")

curl -s -o /dev/null -X POST "$BASE/services" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"title":"bust-probe","type":"srv","description":"x"}'

V_AFTER=$(php artisan tinker --execute="echo \App\Support\CacheKeys::currentVersion('services');")

echo "services version: $V_BEFORE -> $V_AFTER"
# expected: bumped — the single bump invalidates all three buckets at once
```
## 8.4 Invalid type must be 422 (no cache pollution)
```bash

reset_all

curl -i "$BASE/services?type=bogus" -H "Accept: application/json" | head -1
cache_keys "api:services:list:bogus"
# expected: HTTP 422, no key created
```
# 9. Non-GET traffic must not be cached
## 9.1 POST response must be fresh every time
```bash

reset_all

STAMP="post-probe-$(date +%s)"

R1=$(curl -s -X POST "$BASE/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"name\":\"$STAMP\",\"category_id\":1,\"price\":1.00,\"short_description\":\"x\"}" \
  | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)

R2=$(curl -s -X POST "$BASE/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"name\":\"${STAMP}-b\",\"category_id\":1,\"price\":1.00,\"short_description\":\"x\"}" \
  | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)

echo "id1=$R1 id2=$R2"
# expected: two different ids (each POST created a new row)
```
## 9.2 401/403 responses must not populate the cache
```bash

reset_all

curl -s -o /dev/null -X POST "$BASE/products" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name":"unauth-probe","category_id":1,"price":1.00,"short_description":"x"}'

cache_keys "api:products"
# expected: NO api:products:* keys beyond what already existed
```
# 10. TTL behaviour
## 10.1 List keys carry a 5-minute TTL
```bash

reset_all

curl -s -o /dev/null "$BASE/products" -H "Accept: application/json"

php artisan tinker --execute="
  \$row = DB::table('cache')
      ->where('key', 'like', '%api:products:list:%')
      ->first();
  if (\$row) {
      \$ttl = \$row->expiration - time();
      echo \"ttl seconds: \$ttl\n\";
  } else {
      echo \"no key found\n\";
  }
"
# expected: ttl seconds is roughly 300 (may be a few seconds lower by the time you read it)
```
## 10.2 Settings carry a 1-hour TTL
```bash

reset_all

curl -s -o /dev/null "$BASE/settings" -H "Accept: application/json"

php artisan tinker --execute="
  \$row = DB::table('cache')
      ->where('key', 'like', '%api:settings:%')
      ->first();
  if (\$row) {
      \$ttl = \$row->expiration - time();
      echo \"ttl seconds: \$ttl\n\";
  } else {
      echo \"no key found\n\";
  }
"
# expected: ttl seconds is roughly 3600
```
# 11. Negative caching
## 11.1 Missing resource must not be cached as 404 forever
```bash

reset_all

# 404 first
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/products/999999" -H "Accept: application/json"

# Confirm no key was written for that id
cache_keys "api:products:show:999999"
# expected: no key. (Our callbacks return null and do NOT call cache()->remember
# for null — Laravel's remember() would cache the null. This test documents
# that we are not accidentally caching "not found" responses.)
```
### If you do see a 999999 key and you don't want negative caching:
```bash

# remove the key manually
php artisan tinker --execute="
  DB::table('cache')->where('key', 'like', '%999999%')->delete();
"
```

### Then patch the controller's show() to:
```php

$product = Product::with('category')->find($id);
if (!$product) {
    return response()->json(['error' => 'Product not found'], 404);
}

$data = cache()->remember(
    \App\Support\CacheKeys::vShow('products', $id, App::getLocale()),
    \App\Support\CacheKeys::TTL_SHOW,
    fn () => $product->toTranslatedArray()
);
```

# 12. Rapid-fire stress
## 12.1 Ten parallel GETs must not create duplicate keys
```bash

reset_all

seq 1 10 | xargs -n1 -P10 -I{} curl -s -o /dev/null \
  "$BASE/products" -H "Accept: application/json"

cache_keys "api:products:list" | wc -l
# expected: 1 per locale (usually just 1)
```
## 12.2 One write during a burst must eventually win
```bash

reset_all

# Start a background loop that hammers GET /products
( for i in $(seq 1 50); do
    curl -s -o /dev/null "$BASE/products" -H "Accept: application/json"
  done ) &

# Mid-burst, write
sleep 0.2
curl -s -o /dev/null -X POST "$BASE/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name":"burst-probe","category_id":1,"price":1.00,"short_description":"x"}'

wait

# After the burst, the list must contain the new row
curl -s "$BASE/products" -H "Accept: application/json" | grep -c "burst-probe"
# expected: >= 1
```
# 13. Failure recovery
## 13.1 Cache:clear must reset everything
```bash

# Warm several resources
for r in products categories services truck-types projects settings; do
  curl -s -o /dev/null "$BASE/$r" -H "Accept: application/json"
done

BEFORE=$(php artisan tinker --execute="echo DB::table('cache')->count();")
echo "rows before clear: $BEFORE"

php artisan cache:clear > /dev/null

AFTER=$(php artisan tinker --execute="echo DB::table('cache')->count();")
echo "rows after clear:  $AFTER"
# expected: AFTER < BEFORE (ideally 0, but rate limiter keys may also be cleared — that's fine)
```
## 13.2 Corrupt version value must not break reads
```bash

reset_all

# Seed a bogus version
php artisan tinker --execute="cache()->forever('api:products:version', 'not-an-int');"

# Reads must still succeed (currentVersion casts to int, so 'not-an-int' → 0)
curl -s -o /dev/null -w "%{http_code}\n" "$BASE/products" -H "Accept: application/json"
# expected: 200

# Repair it
php artisan tinker --execute="cache()->forever('api:products:version', 1);"
```