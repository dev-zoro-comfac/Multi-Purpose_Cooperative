# Multi-Purpose Cooperative System

A full-stack loan and member management system for a multi-purpose cooperative. The project uses a Laravel API backend and a Next.js frontend.

## Features

- User login with Laravel Sanctum
- Role-based access for admin, accounting, member, and non-member accounts
- User, role, and permission management
- Member records management
- Loan application creation and monitoring
- Accounting loan workflow: review, approve, reject, and release
- Loan document generation/upload flow
- Password setup links for newly created member accounts
- Mailtrap support for local email testing

## Tech Stack

- Backend: Laravel 12, Sanctum, Spatie Permission, Pest/PHPUnit
- Frontend: Next.js 14, React, TypeScript, MUI, React Query, Zod
- Database: MySQL for local development, SQLite in automated tests
- Email testing: Mailtrap sandbox

## Requirements

- PHP 8.2 or newer
- Composer
- Node.js and npm
- MySQL, for example through XAMPP
- Mailtrap account for testing password setup emails

## Backend Setup

From the project root:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

Update `backend/.env` for your local database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=coop_db
DB_USERNAME=root
DB_PASSWORD=
```

Create the database in phpMyAdmin or MySQL:

```sql
CREATE DATABASE coop_db;
```

Run migrations and seeders:

```bash
php artisan migrate:fresh --seed
php artisan config:clear
php artisan serve
```

Backend URL:

```text
http://localhost:8000
```

## Frontend Setup

In a second terminal:

```bash
cd frontend
npm install
```

Create or update `frontend/.env.local`:

```env
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_REVERB_APP_KEY=
NEXT_PUBLIC_REVERB_HOST=localhost
NEXT_PUBLIC_REVERB_PORT=9000
NEXT_PUBLIC_REVERB_SCHEME=http
```

Start the frontend:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:3000
```

## Default Test Accounts

After running `php artisan migrate:fresh --seed`, these accounts are available:

```text
admin@test.com       / Test@123
accounting@test.com  / Test@123
member@test.com      / Test@123
non.member@test.com  / Test@123
```

If your local database still has old roles, run `php artisan migrate:fresh --seed` during development so the database matches the current four-role setup.

## Mailtrap Setup

Mailtrap is used so password setup emails can be viewed in a development inbox.

1. Open Mailtrap.
2. Go to `Sandboxes`.
3. Open `My Sandbox`.
4. Open SMTP settings and choose Laravel.
5. Copy the SMTP values into `backend/.env`.

Example:

```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_FROM_ADDRESS="noreply@mpcs.test"
MAIL_FROM_NAME="MPCS Cooperative System"
```

Then clear cached config:

```bash
cd backend
php artisan config:clear
```

When accounting clicks `Send setup link` on the Members page, the password setup email will appear in the Mailtrap sandbox.

## Password Setup Flow

For a new borrower/member account:

1. Accounting creates a loan or member with an email address.
2. A member user account can be created automatically.
3. Accounting can open `Dashboard > Members`.
4. Click `Send setup link`.
5. The borrower receives a password setup email in Mailtrap.
6. The borrower opens the link and sets their password at `/reset-password`.

## Running Tests

Backend:

```bash
cd backend
php artisan test
```

Focused test files:

```bash
php artisan test tests/Feature/SecurityAndPasswordSetupTest.php
php artisan test tests/Feature/LoanWorkflowTest.php
```

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

## Common Issues

### `vendor/autoload.php` is missing

Run:

```bash
cd backend
composer install
```

### `No application encryption key has been specified`

Run:

```bash
cd backend
php artisan key:generate
php artisan config:clear
```

### Unknown database or database connection refused

Make sure MySQL is running and `DB_DATABASE` exists.

For XAMPP, start MySQL in the XAMPP Control Panel, then create `coop_db` in phpMyAdmin.

### Password setup email does not appear

Check that `MAIL_MAILER=smtp`, Mailtrap credentials are correct, and Laravel config was cleared:

```bash
php artisan config:clear
```
