# Laravel Backend
composer create-project laravel/laravel backend-laravel
cd backend-laravel

php artisan migrate
php artisan db:seed --class=AdminUserSeeder
php artisan storage:link

# React Frontend
npx create-react-app frontend-public
cd frontend-public
npm install axios react-router-dom i18next@23 react-i18next@14.1.3