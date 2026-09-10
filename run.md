#### Backend (Laravel) ####
cd backend-laravel
composer install
cp .env.example .env
# Edit .env with database credentials
php artisan key:generate
# create db
php artisan migrate
# insert to db
php artisan db:seed --class=DatabaseSeeder
# Rebuild DB
php artisan migrate:fresh --seed

# Clear config cache
php artisan config:clear
php artisan route:clear

php artisan storage:link
php artisan serve

# Verify:
php artisan route:list

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