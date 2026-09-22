# 0. Setup
## 0.1 Export base URL and image path
```bash

BASE="http://127.0.0.1:8000/api"
IMG="/home/hkali/Desktop/VioletPro/wallpaper/arch1.png"
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

0.3 Confirm the cache store is not array
```bash
php artisan tinker --execute="echo get_class(cache()->store());"
```

# 1. api limiter — 120/min per IP
## 1.1 Hammer GET /products 130 times — expect 120×200 then 10×429
```bash 
php artisan cache:clear

for i in $(seq 1 130); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    "$BASE/products" -H "Accept: application/json"
done | sort | uniq -c
```

## 1.2 Confirm the 429 response shape and headers
```bash 
curl -i "$BASE/products" -H "Accept: application/json" \
  | grep -i -E "^(HTTP|Retry-After|X-RateLimit)"
```

## 1.3 Recovery after the 60-second window
```bash
echo "waiting 65s for the per-minute window to roll over..."
sleep 65

curl -s -o /dev/null -w "%{http_code}\n" \
  "$BASE/products" -H "Accept: application/json"
```


## 1.4 Per-IP independence (skip if you don't have a second loopback)
```bash
# If 127.0.0.2 is available on your machine:
curl --interface 127.0.0.2 -s -o /dev/null -w "other-ip: %{http_code}\n" \
  "$BASE/products" -H "Accept: application/json"
```

# 2. api-authed limiter — 300/min per user, 30/min per IP for anon
## 2.1 Authenticated bucket — hammer /auth/me 320 times (needs the route to use throttle:api-authed)
```bash
php artisan cache:clear

for i in $(seq 1 320); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    "$BASE/auth/me" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/json"
done | sort | uniq -c
```

## 2.2 Anonymous fallback — 30/min per IP
```bash 
php artisan cache:clear

for i in $(seq 1 400); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    "$BASE/auth/me" -H "Accept: application/json"
done | sort | uniq -c
```
# 3. api-writes limiter — 20/min per user
## 3.1 Twenty-five PUT /products/2 requests — expect 20×200, then 5×429
```bash
php artisan cache:clear

for i in $(seq 1 25); do
  curl -s -o /dev/null -w "%{http_code}\n" -X PUT "$BASE/products/2" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{"price": 79.99}'
done | sort | uniq -c
```

## 3.2 Confirm Retry-After + JSON body on the 429
```bash
curl -i -X PUT "$BASE/products/2" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"price": 79.99}'
```
## 3.3 Recovery after 60s
```bash
sleep 65
curl -s -o /dev/null -w "%{http_code}\n" -X PUT "$BASE/products/2" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"price": 79.99}'
```

# 4. uploads limiter — 10/min per user
## 4.1 Fifteen uploads — expect 10×201, then 5×429
```bash
php artisan cache:clear

for i in $(seq 1 15); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST "$BASE/uploads/products" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/json" \
    -F "file=@$IMG"
done | sort | uniq -c
```

## 4.2 Confirm the 429 body and headers
```bash
curl -i -X POST "$BASE/uploads/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -F "file=@$IMG"
```

## 4.3 Recovery after 60s
```bash
sleep 65
curl -s -o /dev/null -w "%{http_code}\n" -X POST "$BASE/uploads/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -F "file=@$IMG"
```

# 5. api-anon limiter — 60/min per IP
## 5.1 Seventy hits on any route in the api-anon group
```bash
php artisan cache:clear

for i in $(seq 1 70); do
  curl -s -o /dev/null -w "%{http_code}\n" \
    "$BASE/products" -H "Accept: application/json"
done | sort | uniq -c
```

# 6. Login limiter — 5 per email, 20 per IP, 5 per (email,IP) — 15-min window
## 6.1 Five wrong attempts — expect 5×401
```bash 
php artisan cache:clear

for i in 1 2 3 4 5; do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST $BASE/auth/login \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{"email":"admin@automotors.com","password":"WRONG123"}'
done
```
## 6.2 Sixth attempt — expect 429 with Retry-After
```bash
curl -i -X POST $BASE/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@automotors.com","password":"WRONG123"}'
```
## 6.3 Correct password while locked — must also be 429
```bash
curl -i -X POST $BASE/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@automotors.com","password":"password123"}'
```

## 6.4 Email-rotation from the same IP — the IP bucket must trip
```bash
php artisan cache:clear

# 25 fresh emails from the same IP → IP bucket is 20, so 20×401 then 5×429
for i in $(seq 1 25); do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST $BASE/auth/login \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d "{\"email\":\"user$i@example.com\",\"password\":\"WRONG123\"}"
done | sort | uniq -c
```

## 6.5 Reset the login limiter (dev only) before continuing other tests
```bash
php artisan cache:clear
echo "login limiter cleared"
```

# 7. Concurrent burst (optional, more realistic DoS simulation)
## 7.1 Sixty parallel requests — see how many 429s appear (requires xargs -P or GNU parallel)
```bash
php artisan cache:clear

seq 1 60 | xargs -n1 -P20 -I{} curl -s -o /dev/null -w "%{http_code}\n" \
  "$BASE/products" -H "Accept: application/json" \
  | sort | uniq -c
```
```bash 
php artisan cache:clear

seq 1 150 | xargs -n1 -P30 -I{} curl -s -o /dev/null -w "%{http_code}\n" \
  "$BASE/products" -H "Accept: application/json" \
  | sort | uniq -c
```
# 8. Confirm state is being written to the cache store
## 8.1 Peek at the cache after a limited run
```bash
php artisan cache:clear

# Trip the write limit
for i in $(seq 1 22); do
  curl -s -o /dev/null -X PUT "$BASE/products/2" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{"price": 79.99}'
done

# Show limiter keys in the cache (keys are hashed; look at counts)
php artisan tinker --execute="
  \$store = cache()->getStore();
  \$keys = method_exists(\$store, 'connection')
      ? \DB::table(config('cache.stores.'.config('cache.default').'.table', 'cache'))->pluck('key')
      : [];
  dump(\$keys->filter(fn(\$k) => str_contains(\$k, 'timer'))->count() . ' timer keys present');
"
```
# 9. Clear everything before running the next section
```bash
php artisan cache:clear && echo "all limiters reset"
```