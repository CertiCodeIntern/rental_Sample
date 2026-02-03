# Backend-Frontend Integration Guide

> **Purpose**: Configuration settings and variables that need to be synchronized between frontend JavaScript and backend PHP API.

---

## ⚠️ CRITICAL: Environment Configuration

### API Base URLs

The frontend needs to know where the backend API is located. This varies by environment:

```javascript
// In: client/auth/js/auth.js (and similar files)

// DEVELOPMENT (XAMPP on localhost)
API_BASE_URL: '/backend/client/auth/',

// DEVELOPMENT (Project in htdocs subfolder)
API_BASE_URL: '/RENTAL_SAMPLE/backend/client/auth/',

// PRODUCTION (Separate backend server)
API_BASE_URL: 'https://api.yoursite.com/client/auth/',
```

---

## 🔧 Frontend Variables to Adjust

### Client Authentication (`client/auth/js/auth.js`)

| Variable | Description | Default |
|----------|-------------|---------|
| `API_BASE_URL` | Base path to backend API | `/backend/client/auth/` |
| `ENDPOINTS.LOGIN` | Login endpoint filename | `login.php` |
| `ENDPOINTS.REGISTER` | Register endpoint filename | `register.php` |
| `ENDPOINTS.LOGOUT` | Logout endpoint filename | `logout.php` |
| `ENDPOINTS.CHECK_SESSION` | Session check endpoint | `check_session.php` |

### Admin Authentication (`admin/auth/js/auth.js`)

| Variable | Description | Default |
|----------|-------------|---------|
| `API_BASE_URL` | Base path to admin API | `/backend/admin/auth/` |

---

## 🔧 Backend Variables to Adjust

### Database Configuration (`backend/config/database.php`)

| Variable | Description | Default (XAMPP) |
|----------|-------------|-----------------|
| `$host` | Database server | `localhost` |
| `$db_name` | Database name | `rental_system` |
| `$username` | MySQL username | `root` |
| `$password` | MySQL password | `""` (empty) |
| `$port` | MySQL port | `3306` |

### CORS Configuration (`backend/config/cors.php`)

For production, update allowed origins:

```php
// Development (allow all)
header("Access-Control-Allow-Origin: *");

// Production (specific origins)
$allowedOrigins = [
    'https://yoursite.vercel.app',
    'https://www.yoursite.com'
];
```

---

## 📁 File Path Mapping

| Frontend Path | Backend Endpoint |
|---------------|------------------|
| `/client/auth/login.html` | `/backend/client/auth/login.php` |
| `/client/auth/login.html#register` | `/backend/client/auth/register.php` |
| `/admin/auth/login.html` | `/backend/admin/auth/login.php` |

---

## 🗄️ localStorage Keys

These keys are set by frontend after successful auth and should be consistent:

| Key | Set By | Used By | Description |
|-----|--------|---------|-------------|
| `user` | auth.js | components.js | Full user object (JSON) |
| `token` | auth.js | API calls | Session ID or JWT |
| `user_role` | auth.js | components.js | User role (customer/admin) |
| `user_name` | auth.js | components.js | Display name |

### User Object Structure

```javascript
// What backend returns:
{
    "id": 1,
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "09123456789",
    "role": "customer",
    "created_at": "2026-01-01 00:00:00"
}

// What frontend stores in localStorage:
localStorage.setItem('user', JSON.stringify(data.user));
localStorage.setItem('token', data.session_id);
localStorage.setItem('user_role', data.user.role);
localStorage.setItem('user_name', data.user.full_name);
```

---

## 🚀 Deployment Scenarios

### Scenario 1: Local Development (XAMPP)

```
Frontend: http://localhost:5500 (Live Server)
Backend:  http://localhost/backend/
```

**Frontend Config:**
```javascript
API_BASE_URL: 'http://localhost/backend/client/auth/'
```

### Scenario 2: Everything in htdocs

```
Both: http://localhost/RENTAL_SAMPLE/
```

**Frontend Config:**
```javascript
API_BASE_URL: '/RENTAL_SAMPLE/backend/client/auth/'
```

### Scenario 3: Vercel + External Backend

```
Frontend: https://rentit.vercel.app
Backend:  https://api.rentit.com (separate server)
```

**Frontend Config:**
```javascript
API_BASE_URL: 'https://api.rentit.com/client/auth/'
```

⚠️ **Note:** Vercel does NOT support PHP. You need a separate PHP host.

---

## ✅ Checklist Before Deployment

### Frontend
- [ ] Update `API_BASE_URL` in all auth JS files
- [ ] Verify localStorage key names match
- [ ] Test redirect URLs after login

### Backend
- [ ] Update database credentials in `database.php`
- [ ] Configure CORS for production domains
- [ ] Ensure PHP sessions work on hosting

### Database
- [ ] Import `database-schema.sql`
- [ ] Verify table structure matches model
- [ ] Test with sample users

---

## 🔐 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@rentit.com | password |
| Customer | john@example.com | password |
| Customer | jane@example.com | password |

---

## 📝 API Response Format

All backend endpoints return JSON in this format:

### Success Response
```json
{
    "success": true,
    "message": "Operation successful",
    "user": { ... },
    "session_id": "abc123..."
}
```

### Error Response
```json
{
    "success": false,
    "message": "Error description"
}
```

### HTTP Status Codes Used

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET/POST |
| 201 | Created | Successful registration |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Invalid credentials |
| 403 | Forbidden | Wrong role (admin pages) |
| 503 | Service Unavailable | Database connection failed |

---

*Last Updated: February 2, 2026*
