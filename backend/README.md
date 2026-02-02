# 📦 Backend API Structure

> PHP backend for the RentIt Rental Management System.
> Designed for XAMPP/Apache with MySQL database.

---

## 📁 Folder Structure

```
backend/
├── config/                 # Configuration files
│   ├── database.php        # Database connection class
│   └── cors.php            # CORS headers configuration
│
├── helpers/                # Reusable utility functions
│   ├── response.php        # JSON response helpers
│   └── validation.php      # Input validation helpers
│
├── models/                 # Database models (shared)
│   └── User.php            # User model (login, register, CRUD)
│
├── client/                 # Client-side API endpoints
│   └── auth/
│       ├── login.php       # Client login
│       ├── register.php    # Client registration
│       ├── logout.php      # Client logout
│       └── check_session.php
│
├── admin/                  # Admin-side API endpoints
│   └── auth/
│       ├── login.php       # Admin login
│       └── logout.php      # Admin logout
│
└── README.md               # This file
```

---

## 🔧 Setup Instructions

### 1. XAMPP Configuration
1. Copy the `backend/` folder to your XAMPP's htdocs directory
2. Or configure your project path in XAMPP's httpd.conf

### 2. Database Setup
1. Create a MySQL database named `rental_system`
2. Run the SQL schema to create tables (see `/docs/database-schema.sql`)

### 3. Update Configuration
Edit `config/database.php` with your database credentials:
```php
private $host = "localhost";
private $db_name = "rental_system";
private $username = "root";
private $password = "";
```

---

## 🔌 API Endpoints

### Client Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/client/auth/login.php` | Login with email/password |
| POST | `/client/auth/register.php` | Register new customer |
| GET | `/client/auth/check_session.php` | Check if logged in |
| POST | `/client/auth/logout.php` | Logout user |

### Admin Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/admin/auth/login.php` | Admin login |
| POST | `/admin/auth/logout.php` | Admin logout |

---

## 📝 Request/Response Format

### Login Request
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```

### Success Response
```json
{
    "success": true,
    "message": "Login successful",
    "user": {
        "id": 1,
        "full_name": "John Doe",
        "email": "user@example.com",
        "role": "customer"
    },
    "session_id": "abc123..."
}
```

### Error Response
```json
{
    "success": false,
    "message": "Invalid email or password"
}
```

---

## 🔒 Security Features

- Password hashing using `password_hash()` with `PASSWORD_DEFAULT`
- Input sanitization with `htmlspecialchars()` and `strip_tags()`
- Prepared statements to prevent SQL injection
- CORS headers for cross-origin requests
- Email validation using `FILTER_VALIDATE_EMAIL`

---

*Last Updated: February 2, 2026*
