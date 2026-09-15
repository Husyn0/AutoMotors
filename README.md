# AutoMotors

A full-stack automotive management platform built with **Laravel, React, MySQL, and JWT authentication**.

AutoMotors is structured as a multi-application system consisting of a Laravel REST API, a public-facing React application, and a separate React administration dashboard.

---

## ✨ Overview

**AutoMotors** is designed to provide two different experiences:

* **Public Website** — allows visitors to browse and explore the automotive content published by the platform.
* **Admin Dashboard** — provides authenticated administrators with tools to manage the platform's content and data.
* **REST API** — acts as the communication layer between the frontends and the MySQL database.

The project is organized to keep the backend and frontend applications independent while allowing them to communicate through a common API.

---

## 🏗️ Architecture

```text
                        ┌──────────────────────┐
                        │      MySQL Database  │
                        └──────────┬───────────┘
                                   │
                                   │
                        ┌──────────▼───────────┐
                        │    Laravel REST API  │
                        │      + JWT Auth      │
                        └──────────┬───────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
          ┌─────────▼─────────┐       ┌──────────▼─────────┐
          │  Public Frontend  │       │   Admin Frontend   │
          │      React        │       │       React        │
          └───────────────────┘       └────────────────────┘
```

### Applications

| Application       | Technology    | Purpose                                  |
| ----------------- | ------------- | ---------------------------------------- |
| `backend-laravel` | Laravel / PHP | REST API, authentication, database logic |
| `frontend-public` | React         | Public-facing website                    |
| `frontend-admin`  | React         | Administrative dashboard                 |
| MySQL             | MySQL         | Persistent application data              |

---

## 🛠️ Technology Stack

### Backend

* PHP
* Laravel
* MySQL
* JWT Authentication
* Laravel Artisan
* Composer
* REST API

### Frontend

* React
* JavaScript
* Axios
* React Router
* React Icons
* Recharts
* Sass
* i18next
* react-i18next

### Development Tools

* Git
* GitHub
* npm
* Composer
* ImageMagick

---

## 📁 Project Structure

```text
AutoMotors/
│
├── backend-laravel/
│   ├── app/
│   ├── config/
│   ├── database/
│   ├── routes/
│   ├── storage/
│   ├── .env.example
│   └── ...
│
├── frontend-admin/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── frontend-public/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── create.md
├── notes.md
├── run.md
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

* PHP
* Composer
* Laravel-compatible PHP extensions
* MySQL
* Node.js
* npm
* Git

Verify the installations:

```bash
php --version
composer --version
mysql --version
node --version
npm --version
```

---

# ⚙️ Backend Setup

Move into the Laravel backend:

```bash
cd backend-laravel
```

Install PHP dependencies:
https://github.com/Husyn0/AutoMotors
```bash
composer install
```

Create the environment file:

```bash
cp .env.example .env
```

Open `.env` and configure the database connection:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=automotors_db
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```

Create the database in MySQL:

```sql
CREATE DATABASE automotors_db;
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

Generate the JWT secret:

```bash
php artisan jwt:secret
```

Run the database migrations:

```bash
php artisan migrate
```

Seed the database:

```bash
php artisan db:seed --class=DatabaseSeeder
```

Create the storage symbolic link:

```bash
php artisan storage:link
```

Start the Laravel development server:

```bash
php artisan serve
```

The API will normally be available at:

```text
http://localhost:8000
```

---

# 🌐 Public Frontend Setup

Open another terminal:

```bash
cd frontend-public
```

Install dependencies:

```bash
npm install
```

Create/configure the frontend environment file with the API URL:

```env
REACT_APP_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm start
```

The public frontend will normally run at:

```text
http://localhost:3000
```

For a production build:

```bash
npm run build
```

---

# 🔐 Admin Frontend Setup

Open another terminal:

```bash
cd frontend-admin
```

Install dependencies:

```bash
npm install
```

Create/configure the environment file:

```env
REACT_APP_API_URL=http://localhost:8000
```

Start the admin application:

```bash
npm start
```

For a production build:

```bash
npm run build
```

---

# 🗄️ Database

AutoMotors uses **MySQL** as its primary relational database.

Laravel migrations are used to create and maintain the database schema.

To apply migrations:

```bash
php artisan migrate
```

To rebuild the database from scratch and run the seeders:

```bash
php artisan migrate:fresh --seed
```

> ⚠️ `migrate:fresh --seed` deletes the existing database tables before rebuilding them. Use it only in development when you intentionally want to reset the database.

---

# 🔑 Authentication

The backend uses **JWT-based authentication** for protected administrative operations.

The authentication flow is approximately:

```text
Admin Login
     │
     ▼
React Admin Frontend
     │
     │ credentials
     ▼
Laravel API
     │
     ▼
JWT Token
     │
     ▼
Authenticated API Requests
```

The JWT secret is generated locally and should **never be committed to Git**.

---

# 🔧 Useful Laravel Commands

### Start the backend

```bash
php artisan serve
```

### List registered routes

```bash
php artisan route:list
```

### Clear configuration cache

```bash
php artisan config:clear
```

### Clear route cache

```bash
php artisan route:clear
```

### Create storage link

```bash
php artisan storage:link
```

### Run migrations

```bash
php artisan migrate
```

### Run seeders

```bash
php artisan db:seed --class=DatabaseSeeder
```

### Rebuild database

```bash
php artisan migrate:fresh --seed
```

---

# 🖼️ Image Preparation

ImageMagick can be used during development to prepare transparent images and remove white backgrounds.

Install ImageMagick on Ubuntu:

```bash
sudo apt install imagemagick
```

Convert an image:

```bash
convert input.png output.png
```

Remove white background:

```bash
convert input.png -transparent white output.png
```

For images containing near-white backgrounds:

```bash
convert input.jpg -fuzz 10% -transparent white output.png
```

---

# 🧩 Development Notes

The repository also contains additional development documentation:

* [`run.md`](./run.md) — development startup and environment commands
* [`create.md`](./create.md) — initial project creation and dependency setup
* [`notes.md`](./notes.md) — development notes and local setup information

These files preserve implementation notes while this README provides the main project documentation.

---

# 🔒 Environment & Security

Do **not** commit sensitive environment information.

The following should remain local:

```text
.env
JWT secrets
Database passwords
Private API keys
Production credentials
```

Use `.env.example` as the template for required environment variables.

Before deploying the application, replace all development credentials and secrets with production-specific values.

---

# 🧪 Development Workflow

A typical local development setup uses three terminals:

### Terminal 1 — Laravel API

```bash
cd backend-laravel
php artisan serve
```

### Terminal 2 — Public Website

```bash
cd frontend-public
npm start
```

### Terminal 3 — Admin Dashboard

```bash
cd frontend-admin
npm start
```

The resulting development environment is:

```text
Public Website
    │
    └──────► Laravel API ◄────── Admin Dashboard
                    │
                    ▼
               MySQL Database
```

---

# 📌 Project Status

**Status:** Active development

The project is being developed as a full-stack automotive management platform with a separated backend, public frontend, and administration frontend.

Features and architecture may continue to evolve as development progresses.

---

# 🗺️ Roadmap

Potential future improvements include:

* [ ] Production deployment
* [ ] Production environment configuration
* [ ] Improved API documentation
* [ ] Automated testing
* [ ] Backend validation improvements
* [ ] Frontend error handling improvements
* [ ] Improved authentication/security hardening
* [ ] CI/CD pipeline
* [ ] Application monitoring
* [ ] Production database backup strategy
* [ ] Expanded admin analytics
* [ ] Additional automotive management features

---

# 📚 Documentation

| Document    | Description                                   |
| ----------- | --------------------------------------------- |
| `README.md` | Main project documentation                    |
| `run.md`    | Local development and startup commands        |
| `create.md` | Initial project creation and dependency setup |
| `notes.md`  | Development notes and setup references        |

---

# 👨‍💻 Author

**Husyn0**

GitHub: [@Husyn0](https://github.com/Husyn0)

---

## 📄 License

This project is currently provided for development and portfolio purposes.

---

> **AutoMotors** — a modular full-stack automotive platform built with Laravel, React, and MySQL.
