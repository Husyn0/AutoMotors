# Auth

## 0. Setup

### 0.1 Export base URLs and image path

```bash
BASE="http://127.0.0.1:8000/api"
```
### 0.2 Clear any leftover limiter state (dev only)
```bash
php artisan cache:clear
```

### Login
```bash
curl -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email": "admin@automotors.com",
    "password": "password123"
  }'
```


### Register
```bash
curl -X POST http://127.0.0.1:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Test Admin",
    "email": "test@automotors.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'

```

### Refresh Token
```bash
curl -X POST http://127.0.0.1:8000/api/auth/refresh \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"
```

### Rate limiting
#### Five wrong attempts 
```bash
for i in 1 2 3 4 5; do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST $BASE/auth/login \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{"email":"admin@automotors.com","password":"WRONG123"}'
done
# expected: 401 401 401 401 401
```
```bash
# Sixth wrong attempt — 429 + Retry-After
curl -i -X POST $BASE/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@automotors.com","password":"WRONG123"}'
# expected: 429 + Retry-After header
```

### Correct password should ALSO be blocked while locked:
```bash
curl -i -X POST $BASE/auth/login \
# Correct password while locked — MUST also be 429
curl -i -X POST $BASE/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@automotors.com","password":"password123"}'
# expected: 429
```


# Public Content (GET)     

## Categories (public)
```bash
curl http://127.0.0.1:8000/api/categories -H "Accept: application/json"
```
```bash
curl -H "Accept-Language: en" http://127.0.0.1:8000/api/categories
```
```bash
curl http://127.0.0.1:8000/api/categories/1 -H "Accept: application/json"
```



## Products
### List all (default locale = fr)
```bash
curl http://127.0.0.1:8000/api/products -H "Accept: application/json"
```
### List in English
```bash
curl "http://127.0.0.1:8000/api/products" \
  -H "Accept-Language: en" \
  -H "Accept: application/json"
```
### Or via query param
```bash
curl "http://127.0.0.1:8000/api/products?lang=en" -H "Accept: application/json"
```
### Single product
```bash
curl http://127.0.0.1:8000/api/products/1 -H "Accept: application/json"
```




## Services
```bash
# All services (mixed)
curl http://127.0.0.1:8000/api/services -H "Accept: application/json"
```

```bash
curl http://127.0.0.1:8000/api/services/1 -H "Accept: application/json"

```
```bash
curl -H "Accept-Language: en" http://127.0.0.1:8000/api/services
```

```bash
# Only services
curl "http://127.0.0.1:8000/api/services?type=srv" -H "Accept: application/json"
```
```bash
# Only advantages
curl "http://127.0.0.1:8000/api/services?type=adv" -H "Accept: application/json"
```
```bash
# With English locale
curl -H "Accept-Language: en" "http://127.0.0.1:8000/api/services?type=adv"
```

```bash
# Invalid type → 422
curl -i "http://127.0.0.1:8000/api/services?type=bogus" -H "Accept: application/json"
```

## Truck Types
```bash
curl http://127.0.0.1:8000/api/truck-types -H "Accept: application/json"
```
```bash
curl http://127.0.0.1:8000/api/truck-types/1 -H "Accept: application/json"
```
## Projects
```bash
curl http://127.0.0.1:8000/api/projects -H "Accept: application/json"
```
```bash
curl http://127.0.0.1:8000/api/projects/1 -H "Accept: application/json"
```

## Settings
```bash
curl http://127.0.0.1:8000/api/settings -H "Accept: application/json"
```
```bash
curl -H "Accept-Language: en" http://127.0.0.1:8000/api/settings

```

# image uploading
```bash
# served via controller
 curl -I "http://127.0.0.1:8000/api/files/products/arch1-XCh1oYSa.png"
```
```bash
# served via symlink
curl -I "http://127.0.0.1:8000/storage/products/arch1-XCh1oYSa.png"
```
## Upload:
```bash
TOKEN=... # from login
curl -X POST http://127.0.0.1:8000/api/uploads/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -F "file=@/path/to/battery.jpg"
```
```bash
# upload (needs token)
curl -X POST http://127.0.0.1:8000/api/uploads/products \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/tmp/test.jpg" \
  -H "Accept: application/json"
```
```bash
# bad folder → 422
curl -i -X POST http://127.0.0.1:8000/api/uploads/hackers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -F "file=@/home/hkali/Desktop/VioletPro/wallpaper/arch1.png"
```
```bash
# try an encoded traversal that survives routing:
# %2e%2e = ".."  — still can't contain a raw slash without breaking the route match,
# so a route-level failure is expected. But if it DID reach the controller,
# your basename() + whitelist would still block it.
curl -i -X DELETE "http://127.0.0.1:8000/api/uploads/products/..%2F..%2Fetc%2Fpasswd" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```

```bash
curl -X DELETE http://127.0.0.1:8000/api/uploads/products/battery-9f3a2b1c.jpg \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```





# Protected Routes (JWT Required)  
### save the token from login:
```bash
TOKEN=$(curl -s -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@automotors.com","password":"password123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo $TOKEN
```
echo -e '
##Auth check
### Current user  '

```bash
curl http://127.0.0.1:8000/api/auth/me \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```
echo -e '

### Logout '
```bash
curl -X POST http://127.0.0.1:8000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"

```

echo -e '
## CRUD (Protected)

## Categories 
```bash
curl -X POST http://127.0.0.1:8000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Accessoires",
    "icon": "✨",
    "translations": { "en": { "name": "Accessories" } }
  }'
```
```bash
curl -X PUT http://127.0.0.1:8000/api/categories/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name": "Batteries Auto"}'
```
```bash
curl -X DELETE http://127.0.0.1:8000/api/categories/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```


## Products
### CREATE '
```bash
curl -X POST http://127.0.0.1:8000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Batterie Test",
    "category_id": 1,
    "price": 99.99,
    "short_description": "Description test",
    "translations": {
      "en": {
        "name": "Test Battery",
        "short_description": "Test description"
      }
    }
  }'
```
echo -e '
### UPDATE (replace 1 with actual ID) '
```bash
curl -X PUT http://127.0.0.1:8000/api/products/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"price": 79.99}'
```
### DELETE
```bash
curl -X DELETE http://127.0.0.1:8000/api/products/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```

echo -e '
## Services
### CREATE '
```bash
curl -X POST http://127.0.0.1:8000/api/services \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "title": "Service Test",
    "description": "Description test",
    "translations": {
      "en": {
        "title": "Test Service",
        "description": "Test description"
      }
    }
  }'
```
```bash
## Create a service (type defaults to 'srv' if omitted)
curl -X POST http://127.0.0.1:8000/api/services \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "title": "Nouveau service",
    "type": "srv",
    "description": "Description",
    "translations": { "en": { "title": "New service", "description": "Description" } }
  }'
```
```bash
## Create an advantage
curl -X POST http://127.0.0.1:8000/api/services \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "title": "Avantage test",
    "type": "adv",
    "description": "Description avantage",
    "translations": { "en": { "title": "Test advantage", "description": "Advantage description" } }
  }'
```
```bash
## Update type
curl -X PUT http://127.0.0.1:8000/api/services/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"type": "adv"}'
```
echo -e '
### UPDATE '
```bash
curl -X PUT http://127.0.0.1:8000/api/services/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"title": "Service Modifié"}'
```
echo -e '
### DELETE '
```bash
curl -X DELETE http://127.0.0.1:8000/api/services/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```




echo -e '
## Truck Types
### CREATE '
```bash
curl -X POST http://127.0.0.1:8000/api/truck-types \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Camion Test",
    "models": "Volvo, Scania",
    "description": "Description",
    "icon": "🚛",
    "translations": {
      "en": {
        "name": "Test Truck",
        "description": "Test description"
      }
    }
  }'
```
echo -e '
### UPDATE '
```bash
curl -X PUT http://127.0.0.1:8000/api/truck-types/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name": "Camion Modifié"}'
```

echo -e '
### DELETE '
```bash
curl -X DELETE http://127.0.0.1:8000/api/truck-types/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```


echo -e '
## Projects '
### CREATE
```bash
curl -X POST http://127.0.0.1:8000/api/projects \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "title": "Projet Test",
    "description": "Description test",
    "image": "🔧",
    "translations": {
      "en": {
        "title": "Test Project",
        "description": "Test description"
      }
    }
  }'
```
echo -e '
### UPDATE '
```bash
curl -X PUT http://127.0.0.1:8000/api/projects/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"title": "Projet Modifié"}'
```
echo -e ' 
### DELETE '
```bash
curl -X DELETE http://127.0.0.1:8000/api/projects/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```


echo -e '
## Settings '
```bash
curl -X PUT http://127.0.0.1:8000/api/settings \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "company_name": "AUTOMOTORS CI",
    "email_address": "new@automotors.com"
  }'
```
