# RentIt Login Credentials

## � Localhost Setup Instructions

### Prerequisites
- XAMPP installed (with Apache and MySQL)
- Project location: `C:\Users\Mac\Desktop\Coding Projects\2026\Projects Intern\rental_Sample`

### Step 1: Copy Project to XAMPP
The project is already copied to: `C:\xampp\htdocs\rental_Sample`

### Step 2: Start XAMPP Services
1. Open XAMPP Control Panel
2. Start **Apache** (for web server)
3. Start **MySQL** (for database)

### Step 3: Setup Database
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Click "Import" tab
3. Choose file: `C:\xampp\htdocs\rental_Sample\backend\database-schema.sql`
4. Click "Go" to import
5. This creates:
   - Database: `rental_system`
   - Table: `users` with default accounts

### Step 4: Access the Application
- **Landing Page:** `http://localhost/rental_Sample/`
- **Client Login:** `http://localhost/rental_Sample/client/auth/login.php`
- **Admin Login:** `http://localhost/rental_Sample/admin/auth/login.php`

---

## 🔐 Admin Portal
Access: `http://localhost/rental_Sample/admin/auth/login.php`

| Field | Value |
|-------|-------|
| **Email** | `admin@rentit.com` |
| **Password** | `password` |
| **Role** | System Admin |

---

## 👤 Client Portal
Access: `http://localhost/rental_Sample/client/auth/login.php`

### Test Account 1
| Field | Value |
|-------|-------|
| **Email** | `john@example.com` |
| **Password** | `password` |
| **Name** | John Doe |

### Test Account 2
| Field | Value |
|-------|-------|
| **Email** | `jane@example.com` |
| **Password** | `password` |
| **Name** | Jane Smith |

---

## 🔧 Troubleshooting

### Apache won't start?
- Check if port 80 is used by another program
- Or change Apache port in XAMPP config

### Database connection error?
- Verify MySQL is running in XAMPP
- Check `backend/config/database.php` has correct credentials:
  - Host: `localhost`
  - Database: `rental_system`
  - Username: `root`
  - Password: `` (empty)

### CSS/JS not loading?
- Verify `<base href="/rental_Sample/">` is in HTML files
- Check browser console for 404 errors

---

## ⚠️ Important Notes

- All passwords are hashed using `password_hash()` with `PASSWORD_DEFAULT`
- Plain text password for all accounts: `password`
- **Change these credentials before production deployment!**
