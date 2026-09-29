# Memory Management
##
### Verify throwaway:
```bash
TOKEN=$(curl -s -X POST http://127.0.0.1:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@automotors.com","password":"password123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
```
```bash
IMG=$(curl -s -X POST http://127.0.0.1:8000/api/uploads/products \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@/home/hkali/Desktop/VioletPro/wallpaper/arch1.png" \
  | grep -o '"path":"[^"]*"' | cut -d'"' -f4)
echo "uploaded: $IMG"
```
```bash
PID=$(curl -s -X POST http://127.0.0.1:8000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"obs-test\",\"category_id\":1,\"price\":1,\"short_description\":\"x\",\"image\":\"$IMG\"}" \
  | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
echo "product: $PID"
```
```bash
ls storage/app/public/products/ | grep "$(basename $IMG)"   # should exist
```
```bash
curl -X DELETE "http://127.0.0.1:8000/api/products/$PID" \
  -H "Authorization: Bearer $TOKEN"
```
```bash
ls storage/app/public/products/ | grep "$(basename $IMG)" || echo "GONE ✓"   # should be gone
```


