# Backend (Laravel) 
```bash
cd backend-laravel

composer install

cp .env.example .env
```
## Edit .env with database credentials
```bash
php artisan key:generate
```
## create db

```bash
php artisan migrate
```
## insert to db
```bash
php artisan db:seed --class=DatabaseSeeder
```
## default Laravel cache migration
```bash
php artisan make:cache-table
php artisan make:queue-table       # (optional, for queue)
php artisan make:session-table     # (optional, but your SESSION_DRIVER=database)
```
## Rebuild DB
```bash
php artisan migrate:fresh --seed
```
## Clear config cache
```bash
php artisan config:clear
php artisan route:clear

php artisan storage:link
php artisan serve
 ```
## Verify:
```bash
php artisan route:list
```
# Public Frontend 
```bash
cd frontend-public
npm install
```
## Create .env with REACT_APP_API_URL
```bash
npm start
npm run build  # For production
```

# Admin Frontend 
```bash
cd frontend-admin
npm install
```
## Create .env with REACT_APP_API_URL
```bash
npm start
npm run build  # For production
```