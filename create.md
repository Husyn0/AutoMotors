# Laravel Backend
```bash
composer create-project laravel/laravel backend-laravel

cd backend-laravel
```
# Install required packages
```bash
composer require tymon/jwtauth

composer require laravel/sanctum

composer require laravel/cors
```

# Generate application key and JWT secret:
```bash
php artisan key:generate

php artisan jwt:secret



php artisan migrate

php artisan db:seed --class=AdminUserSeeder

php artisan storage:link

```

# React Frontend
```bash
npx create-react-app frontend-public

cd frontend-public

npm install axios react-router-dom i18next@23 react-i18next@14.1.3
```


# create transparent background icons
```bash
sudo apt install imagemagick

convert input.png output.png

convert input.png -transparent white output.png

convert input.jpg -fuzz 10% -transparent white output.png
```