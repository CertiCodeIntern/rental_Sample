# 🚀 Local Development Setup Guide

> How to run the RentIt project locally with both frontend and PHP backend.

---

## Option 1: Apache Alias (Recommended)

This lets you keep your project in your preferred folder while accessing it via localhost.

### Step 1: Edit Apache Config

1. Open `C:\xampp\apache\conf\httpd.conf` in a text editor (as Administrator)
2. Add these lines at the end:

```apache
# RentIt Project Alias
Alias /rentit "C:/Users/Mac/Desktop/Coding Projects/2026/Projects Intern/rental_Sample"
<Directory "C:/Users/Mac/Desktop/Coding Projects/2026/Projects Intern/rental_Sample">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

3. Save the file
4. Restart Apache from XAMPP Control Panel

### Step 2: Access Your Project

- Frontend: `http://localhost/rentit/client/auth/login.html`
- Backend API: `http://localhost/rentit/backend/client/auth/login.php`

### Step 3: Update Frontend Config

In `client/auth/js/auth.js`, set:
```javascript
API_BASE_URL: '/rentit/backend/client/auth/',
```

---

## Option 2: Symbolic Link

Create a link from htdocs to your project folder.

### PowerShell (Run as Administrator)

```powershell
New-Item -ItemType SymbolicLink -Path "C:\xampp\htdocs\rentit" -Target "C:\Users\Mac\Desktop\Coding Projects\2026\Projects Intern\rental_Sample"
```

### Access

Same as Option 1: `http://localhost/rentit/...`

---

## Option 3: Live Server + XAMPP Combo

Use VS Code Live Server for frontend, XAMPP for backend.

### Step 1: Start XAMPP

Only start Apache and MySQL from XAMPP Control Panel.

### Step 2: Create Backend Alias

Add to `httpd.conf`:
```apache
Alias /backend "C:/Users/Mac/Desktop/Coding Projects/2026/Projects Intern/rental_Sample/backend"
<Directory "C:/Users/Mac/Desktop/Coding Projects/2026/Projects Intern/rental_Sample/backend">
    Options Indexes FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

### Step 3: Update Frontend Config

In `client/auth/js/auth.js`:
```javascript
API_BASE_URL: 'http://localhost/backend/client/auth/',
```

### Step 4: Run Frontend

Right-click `index.html` → "Open with Live Server"

- Frontend: `http://127.0.0.1:5500`
- Backend: `http://localhost/backend/`

---

## 🗄️ Database Setup

### Step 1: Start MySQL

From XAMPP Control Panel, click "Start" next to MySQL.

### Step 2: Open phpMyAdmin

Go to `http://localhost/phpmyadmin`

### Step 3: Create Database

1. Click "New" in the left sidebar
2. Enter database name: `rental_system`
3. Click "Create"

### Step 4: Import Schema

1. Select the `rental_system` database
2. Click "Import" tab
3. Choose file: `backend/database-schema.sql`
4. Click "Go"

---

## ✅ Quick Test

### Test Backend Directly

Open in browser:
```
http://localhost/rentit/backend/client/auth/check_session.php
```

Should return:
```json
{"success":true,"message":"No active session","authenticated":false}
```

### Test Login API

Use Postman or curl:
```bash
curl -X POST http://localhost/rentit/backend/client/auth/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password"}'
```

---

## 🔧 Troubleshooting

### "Access Denied" Error

Make sure the Directory block in httpd.conf has:
```apache
Require all granted
```

### "404 Not Found"

- Check the path in Alias matches your actual folder
- Restart Apache after changing httpd.conf

### "Database Connection Failed"

- Make sure MySQL is running in XAMPP
- Check credentials in `backend/config/database.php`
- Verify database `rental_system` exists

### CORS Errors in Browser Console

The frontend and backend are on different ports. Update `cors.php`:
```php
header("Access-Control-Allow-Origin: *");
```

---

*Last Updated: February 2, 2026*
