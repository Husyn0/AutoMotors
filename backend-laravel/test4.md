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

