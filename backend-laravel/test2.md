# test2.md — Image / Upload Test Suite

Preconditions:
- `php artisan storage:link` has been run
- `APP_URL` in `.env` matches your dev URL
- `HasImageUrl` trait used in Product, Category, Project
- `Translatable::toTranslatedArray()` includes the image-URL loop
- `UploadController` routes registered in `routes/api.php`
- Server running: `php artisan serve`

---

## 0. Setup

### 0.1 Export base URLs and image path

```bash
BASE="http://127.0.0.1:8000/api"
IMG="/home/hkali/Desktop/VioletPro/wallpaper/arch1.png"
```

### 0.2 Login — fresh token

```bash
TOKEN=$(curl -s -X POST $BASE/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"admin@automotors.com","password":"password123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "TOKEN=$TOKEN"
```

### 0.3 Upload helper function

```bash
upload() {
  curl -s -X POST "$BASE/uploads/$1" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/json" \
    -F "file=@$2" \
    | grep -o '"path":"[^"]*"' | cut -d'"' -f4
}
```

### 0.4 Sanity — first upload

```bash
IMG_PATH=$(upload products "$IMG")
echo "IMG_PATH=$IMG_PATH"
```

---

## 1. Upload — success cases

### 1.1 Upload to each whitelisted folder

```bash
for folder in products categories services truck-types projects settings; do
  echo "--- $folder ---"
  curl -s -X POST "$BASE/uploads/$folder" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/json" \
    -F "file=@$IMG"
  echo
done
```

### 1.2 Upload with explicit Accept header

```bash
curl -i -X POST "$BASE/uploads/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -F "file=@$IMG"
```

### 1.3 Symlink serve check

```bash
curl -I "$BASE/storage/$IMG_PATH"
```

### 1.4 Controller serve check

```bash
curl -I "$BASE/files/$IMG_PATH"
```

---

## 2. Upload — failure cases

### 2.1 Upload without auth → 401

```bash
curl -i -X POST "$BASE/uploads/products" \
  -H "Accept: application/json" \
  -F "file=@$IMG"
```

### 2.2 Upload to invalid folder → 422

```bash
curl -i -X POST "$BASE/uploads/hackers" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -F "file=@$IMG"
```

### 2.3 Upload with missing file field → 422

```bash
curl -i -X POST "$BASE/uploads/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```

### 2.4 Upload disallowed MIME (.php) → 422

```bash
echo "<?php echo 'pwn'; ?>" > /tmp/shell.php

curl -i -X POST "$BASE/uploads/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -F "file=@/tmp/shell.php"
```

### 2.5 Upload oversize file → 422 (optional, needs >10MB)

```bash
dd if=/dev/zero of=/tmp/big.png bs=1M count=15

curl -i -X POST "$BASE/uploads/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -F "file=@/tmp/big.png"
```

### 2.6a Traversal in folder segment (POST)

```bash
curl -i -X POST "$BASE/uploads/..%2Fpublic" \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@$IMG"
```

### 2.6b Traversal in file segment (DELETE) → 404

```bash
curl -i -X DELETE "$BASE/uploads/products/..%2F..%2Fetc%2Fpasswd" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```

### 2.6c Traversal on stream route (GET) → 404

```bash
curl -i "$BASE/files/products/..%2F..%2Fetc%2Fpasswd" \
  -H "Accept: application/json"
```

---

## 3. Serve

### 3.1 Serve existing file via symlink

```bash
curl -I "$BASE/storage/$IMG_PATH"
```

### 3.2 Serve existing file via controller

```bash
curl -I "$BASE/files/$IMG_PATH"
```

### 3.3 Non-existent file → 404 (controller)

```bash
curl -i "$BASE/files/products/does-not-exist.png" \
  -H "Accept: application/json"
```

### 3.4 Non-existent file → 404 (symlink)

```bash
curl -I "$BASE/storage/products/does-not-exist.png"
```

### 3.5 Invalid folder on stream route → 404

```bash
curl -i "$BASE/files/hackers/anything.png" \
  -H "Accept: application/json"
```

---

## 4. Delete

### 4.1 Upload throwaway file then delete it

```bash
TMP_PATH=$(upload products "$IMG")
echo "TMP_PATH=$TMP_PATH"

curl -i -X DELETE "$BASE/uploads/products/$(basename $TMP_PATH)" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```

### 4.2 Verify deleted file is gone

```bash
curl -I "$BASE/storage/$TMP_PATH"
```

### 4.3 Delete again → 404

```bash
curl -i -X DELETE "$BASE/uploads/products/$(basename $TMP_PATH)" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```

### 4.4 Delete without auth → 401

```bash
curl -i -X DELETE "$BASE/uploads/products/whatever.png" \
  -H "Accept: application/json"
```

---

## 5. Product ↔ Image

### 5.1 Upload image + create product with it

```bash
PIMG=$(upload products "$IMG")
echo "PIMG=$PIMG"

curl -i -X POST "$BASE/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"name\": \"Batterie Image Test\",
    \"category_id\": 1,
    \"price\": 99.99,
    \"short_description\": \"Test avec image\",
    \"image\": \"$PIMG\",
    \"translations\": { \"en\": { \"name\": \"Image Test Battery\" } }
  }"
```

### 5.2 GET product by id

```bash
PID=10
curl -s "$BASE/products/$PID" | python3 -m json.tool
```

### 5.3 Verify product image URL serves

```bash
curl -I "$BASE/storage/$PIMG"
```

### 5.4 Update product image

```bash
PIMG2=$(upload products "$IMG")
echo "PIMG2=$PIMG2"

curl -i -X PUT "$BASE/products/$PID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"image\": \"$PIMG2\"}"
```

### 5.5 Locale-independent image_url check

```bash
curl -s -H "Accept-Language: en" "$BASE/products/$PID" | python3 -m json.tool

curl -s -H "Accept-Language: fr" "$BASE/products/$PID" | python3 -m json.tool
```

### 5.6 Legacy path passthrough

```bash
curl -s -X PUT "$BASE/products/$PID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"image": "/images/battery1.jpg"}' | python3 -m json.tool
```

### 5.7 Absolute URL passthrough

```bash
curl -s -X PUT "$BASE/products/$PID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"image": "https://cdn.example.com/foo.png"}' | python3 -m json.tool
```

### 5.8 Null image

```bash
curl -s -X PUT "$BASE/products/$PID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"image": null}' | python3 -m json.tool
```

### 5.9 Restore image then delete product

```bash
curl -s -X PUT "$BASE/products/$PID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"image\": \"$PIMG2\"}" > /dev/null

curl -i -X DELETE "$BASE/products/$PID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"

curl -I "$BASE/storage/$PIMG2"
```

---

## 6. Category ↔ Image

### 6.1 Create category with uploaded image

```bash
CIMG=$(upload categories "$IMG")

curl -s -X POST "$BASE/categories" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"name\": \"Cat avec image\",
    \"icon\": \"🧪\",
    \"image\": \"$CIMG\",
    \"translations\": { \"en\": { \"name\": \"Cat with image\" } }
  }" | python3 -m json.tool
```

### 6.2 GET categories list

```bash
curl -s "$BASE/categories" | python3 -m json.tool
```

### 6.3 GET single category

```bash
CID=$(curl -s "$BASE/categories" \
  | grep -o '"id":[0-9]*' | tail -1 | cut -d: -f2)
echo "CID=$CID"

curl -s "$BASE/categories/$CID" | python3 -m json.tool
```

### 6.4 Update category image

```bash
CIMG2=$(upload categories "$IMG")

curl -s -X PUT "$BASE/categories/$CID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"image\": \"$CIMG2\"}" | python3 -m json.tool
```

### 6.5 Verify updated category image serves

```bash
curl -I "$BASE/storage/$CIMG2"
```

### 6.6 Delete category

```bash
curl -s -X DELETE "$BASE/categories/$CID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```

---

## 7. Project ↔ Image

### 7.1 Create project with uploaded image

```bash
PRIMG=$(upload projects "$IMG")

curl -s -X POST "$BASE/projects" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"title\": \"Projet Image\",
    \"description\": \"Avec image\",
    \"image\": \"$PRIMG\",
    \"translations\": { \"en\": { \"title\": \"Image Project\" } }
  }" | python3 -m json.tool
```

### 7.2 GET projects list + single

```bash
curl -s "$BASE/projects" | python3 -m json.tool

PRID=$(curl -s "$BASE/projects" \
  | grep -o '"id":[0-9]*' | tail -1 | cut -d: -f2)
echo "PRID=$PRID"

curl -s "$BASE/projects/$PRID" | python3 -m json.tool
```

### 7.3 Update project image

```bash
PRIMG2=$(upload projects "$IMG")

curl -s -X PUT "$BASE/projects/$PRID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"image\": \"$PRIMG2\"}" | python3 -m json.tool
```

### 7.4 Verify updated project image serves

```bash
curl -I "$BASE/storage/$PRIMG2"
```

### 7.5 Delete project

```bash
curl -s -X DELETE "$BASE/projects/$PRID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```

---

## 8. Product → Category relation

### 8.1 Attach image to category 1

```bash
CIMG3=$(upload categories "$IMG")

curl -s -X PUT "$BASE/categories/1" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{\"image\": \"$CIMG3\"}" > /dev/null
```

### 8.2 Create product in category 1 with own image

```bash
PIMG3=$(upload products "$IMG")

PID3=$(curl -s -X POST "$BASE/products" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d "{
    \"name\": \"Relation Image Test\",
    \"category_id\": 1,
    \"price\": 12.34,
    \"short_description\": \"Relation\",
    \"image\": \"$PIMG3\"
  }" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)

echo "PID3=$PID3"
```

### 8.3 Fetch product — nested category must carry image_url

```bash
curl -s "$BASE/products/$PID3" | python3 -m json.tool
```

### 8.4 Same fetch in EN locale

```bash
curl -s -H "Accept-Language: en" "$BASE/products/$PID3" | python3 -m json.tool
```

### 8.5 Delete relation-test product

```bash
curl -s -X DELETE "$BASE/products/$PID3" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```

---

## 9. Consistency checks

### 9.1 Three access paths — sha256 must match

```bash
TEST=$(upload products "$IMG")

URL=$(curl -s -X POST "$BASE/uploads/products" \
        -H "Authorization: Bearer $TOKEN" \
        -F "file=@$IMG" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)

curl -s "$BASE/storage/$TEST" -o /tmp/via-symlink.png
curl -s "$BASE/files/$TEST"  -o /tmp/via-controller.png
curl -s "$URL"               -o /tmp/via-url.png

sha256sum /tmp/via-symlink.png /tmp/via-controller.png /tmp/via-url.png
```

### 9.2 Rapid uploads — filenames must be unique

```bash
for i in 1 2 3 4 5; do
  upload products "$IMG"
done
```

### 9.3 Folder isolation

```bash
P=$(upload products   "$IMG")
C=$(upload categories "$IMG")
echo "$P"
echo "$C"

ls -la storage/app/public/products/ storage/app/public/categories/
```

---

## 10. Regression — test1.md endpoints

### 10.1 Auth endpoints

```bash
curl -s $BASE/auth/me         -H "Authorization: Bearer $TOKEN" -H "Accept: application/json"

curl -s $BASE/auth/refresh -X POST -H "Authorization: Bearer $TOKEN" -H "Accept: application/json"
```

### 10.2 Public reads

```bash
curl -s $BASE/categories                        -H "Accept: application/json"

curl -s $BASE/products                          -H "Accept: application/json"

curl -s $BASE/services                          -H "Accept: application/json"

curl -s "$BASE/services?type=srv"               -H "Accept: application/json"

curl -s "$BASE/services?type=adv"               -H "Accept: application/json"

curl -s $BASE/truck-types                       -H "Accept: application/json"

curl -s $BASE/projects                          -H "Accept: application/json"

curl -s $BASE/settings                          -H "Accept: application/json"

curl -s -H "Accept-Language: en" $BASE/settings -H "Accept: application/json"
```

### 10.3 Protected writes on non-image models

```bash
curl -s -X POST $BASE/truck-types \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"name":"T","models":"M","description":"D"}'
```

```bash
curl -s -X POST $BASE/services \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"title":"S","type":"srv","description":"D"}'
```

---

## 11. Disk state inspection

### 11.1 List all uploaded files

```bash
find storage/app/public -type f | sort
```

### 11.2 Confirm symlink target

```bash
ls -la public/storage
```

---

# Result matrix

| # | Area | Test | Expected |
|---|---|---|---|
| 1 | Upload | Each folder | 201 + path/url |
| 1 | Upload | Symlink serve | 200 |
| 1 | Upload | Controller serve | 200 |
| 2 | Upload | No auth | 401 |
| 2 | Upload | Bad folder | 422 + allowed |
| 2 | Upload | Missing file | 422 |
| 2 | Upload | `.php` | 422 |
| 2 | Upload | Oversize | 422 |
| 2 | Upload | Traversal (POST/GET/DELETE) | 405 / 404 |
| 3 | Serve | Existing file (both paths) | 200 |
| 3 | Serve | Missing file | 404 |
| 3 | Serve | Bad folder | 404 |
| 4 | Delete | Happy | 200 |
| 4 | Delete | Repeat | 404 |
| 4 | Delete | No auth | 401 |
| 5 | Product | Create with `image` | `image` + `image_url` |
| 5 | Product | GET | Both present |
| 5 | Product | Update image | Reflects new |
| 5 | Product | Locale en/fr | Same URL |
| 5 | Product | Legacy path | Unchanged |
| 5 | Product | Absolute URL | Unchanged |
| 5 | Product | Null image | `null`/`null` |
| 5 | Product | Delete | File remains |
| 6 | Category | CRUD + image | `image_url` present |
| 7 | Project | CRUD + image | `image_url` present |
| 8 | Relation | Product → Category | Nested `image_url` |
| 8 | Relation | Locale en | Nested translated + `image_url` |
| 9 | Consistency | 3 access paths sha256 | Identical |
| 9 | Consistency | 5 rapid uploads | 5 distinct names |
| 9 | Consistency | Folder isolation | No cross-contamination |
| 10 | Regression | All `test1.md` endpoints | Unchanged |

---

# Known gaps (documented, not bugs)

1. No auto-delete of replaced files on update.
2. No cascade delete of image when model is deleted.
3. `image` column not validated (`max:255` / `string`).
4. `Service` and `TruckType` have no `image` column.