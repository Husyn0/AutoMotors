# Backend (Laravel)
# 1. Create database in MySQL
# Open MySQL and run:
CREATE DATABASE automotors_db;

# 2. Install dependencies
cd automotors-backend
composer install

# 3. Copy .env.example to .env and configure database
cp .env.example .env
# Edit .env file with your database credentials

# 4. Generate application key
php artisan key:generate

# 5. Generate JWT secret
php artisan jwt:secret

# 6. Run migrations and seeders
php artisan migrate --seed

# 7. Start Laravel server
php artisan serve
# Server running at http://localhost:8000




# Frontend Admin
# 1. Create React app for admin
npx create-react-app frontend-admin
cd frontend-admin

# 2. Install required npm packages
npm install axios react-router-dom react-icons recharts sass

# 3. Copy all the files provided above into the src folder

# 4. Start the development server
npm start
# Runs on http://localhost:3000


# Default Admin Login Credentials
Email: admin@automotors.com
Password: password123

# Complete NPM Packages List for Frontend Admin


{
  "dependencies": {
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.3",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.20.0",
    "react": "^19.2.8",
    "react-dom": "^19.2.8",
    "react-icons": "^5.7.0",
    "react-router-dom": "^7.18.3",
    "react-scripts": "5.0.1",
    "recharts": "^2.10.3",
    "sass": "^1.104.0",
    "web-vitals": "^2.1.4"
  }
}



# Complete Composer Packages for Backend

{
  "require": {
    "php": "^8.1",
    "laravel/framework": "^10.0",
    "laravel/sanctum": "^3.2",
    "laravel/tinker": "^2.8",
    "tymon/jwt-auth": "^2.0"
  }
}



# Login info:
'email' => 'admin@automotors.com'
'password' => Hash::make('password123'),