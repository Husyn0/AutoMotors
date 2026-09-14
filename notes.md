# ***Backend (Laravel)***
## 1. Create database in MySQL
### Open MySQL and run:
```mysql
CREATE DATABASE automotors_db;
```

## 2. Install dependencies
```bash
cd automotors-backend
# Install dependencies
composer install
```
## 3. Copy .env.example to .env and configure database
```bash
cp .env.example .env
```
### Edit .env file with your database credentials

## 4. Generate application key
```bash
php artisan key:generate
```
## 5. Generate JWT secret
```bash
php artisan jwt:secret
```
## 6. Run migrations and seeders
```bash
php artisan migrate --seed
```
## 7. Start Laravel server
```bash
php artisan serve
```
### Server running at http://localhost:8000

# ***Frontend Admin***
## 1. Create React app for admin
```bash
npx create-react-app frontend-admin

cd frontend-admin
```
## 2. Install required npm packages
```bash
npm install axios react-router-dom react-icons recharts sass
```
## 3. Copy all the files provided above into the src folder

## 4. Start the development server
```bash
npm start
```
## Runs on http://localhost:3000


# ***Default Admin Login Credentials***
### Email: 
```
admin@automotors.com
```
### Password: 
```
password123
```