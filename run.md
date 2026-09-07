#### Backend (Laravel) ####
cd backend-laravel
composer install
cp .env.example .env
# Edit .env with database credentials
php artisan key:generate
php artisan migrate
php artisan db:seed --class=AdminUserSeeder
php artisan storage:link
php artisan serve


#### Public Frontend #####
cd frontend-public
npm install
# Create .env with REACT_APP_API_URL
npm start
npm run build  # For production


#### Admin Frontend ####
cd frontend-admin
npm install
# Create .env with REACT_APP_API_URL
npm start
npm run build  # For production