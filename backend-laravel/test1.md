# Auth
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


# Public Content (GET)     
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
curl http://127.0.0.1:8000/api/services -H "Accept: application/json"
echo -e '
'
curl http://127.0.0.1:8000/api/services/1 -H "Accept: application/json"
echo -e '
'
curl -H "Accept-Language: en" http://127.0.0.1:8000/api/services
```

## Truck Types
```bash
curl http://127.0.0.1:8000/api/truck-types -H "Accept: application/json"
echo -e '
'
curl http://127.0.0.1:8000/api/truck-types/1 -H "Accept: application/json"

#Projects
curl http://127.0.0.1:8000/api/projects -H "Accept: application/json"
echo -e '
'
curl http://127.0.0.1:8000/api/projects/1 -H "Accept: application/json"


#Settings
curl http://127.0.0.1:8000/api/settings -H "Accept: application/json"
echo -e '
'
curl -H "Accept-Language: en" http://127.0.0.1:8000/api/settings

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

## Products
### CREATE '
```bash
curl -X POST http://127.0.0.1:8000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "name": "Batterie Test",
    "category": "batteries",
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
