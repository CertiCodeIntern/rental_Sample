# URL Path Convention Guide

## Overview

This project uses `<base href="/rental_Sample/">` in all PHP files to establish a base URL for relative paths. This guide explains how to write URLs correctly so they work in the XAMPP/Hostinger environment.

## The Golden Rule

**Always use relative paths WITHOUT a leading `/`**

```html
<!-- ✅ CORRECT - Relative path (works with base href) -->
<a href="client/catalog/catalog.php">Browse Catalog</a>

<!-- ❌ WRONG - Absolute path (ignores base href) -->
<a href="/client/catalog/catalog.php">Browse Catalog</a>
```

## Why This Matters

When you have `<base href="/rental_Sample/">` in your HTML:

| Path Type | Code | Resolves To |
|-----------|------|-------------|
| ✅ Relative | `href="client/catalog/catalog.php"` | `/rental_Sample/client/catalog/catalog.php` |
| ❌ Absolute | `href="/client/catalog/catalog.php"` | `/client/catalog/catalog.php` (BROKEN!) |

Absolute paths (starting with `/`) **bypass** the base href entirely!

## Examples

### HTML Links
```html
<!-- Navigation links -->
<a href="index.php">Home</a>
<a href="client/dashboard/dashboard.php">Dashboard</a>
<a href="admin/dashboard/dashboard.php">Admin Dashboard</a>
<a href="pages/aboutus.php">About Us</a>

<!-- Image sources -->
<img src="assets/images/rIT_logo_tp.png" alt="Logo">

<!-- CSS/JS includes -->
<link rel="stylesheet" href="shared/css/globals.css">
<script src="shared/js/components.js"></script>
```

### JavaScript Redirects
```javascript
// ✅ CORRECT
window.location.href = 'client/dashboard/dashboard.php';
window.location.href = 'admin/auth/login.php';
window.location.href = `admin/orders/orderdetail.php?id=${orderId}`;

// ❌ WRONG
window.location.href = '/client/dashboard/dashboard.php';
window.location.href = '/admin/auth/login.php';
```

### Component Configuration (components.js / admin-components.js)
```javascript
// ✅ CORRECT
clientNavTabs: [
    { id: 'dashboard', href: 'client/dashboard/dashboard.php' },
    { id: 'catalog', href: 'client/catalog/catalog.php' },
],

// ❌ WRONG
clientNavTabs: [
    { id: 'dashboard', href: '/client/dashboard/dashboard.php' },
    { id: 'catalog', href: '/client/catalog/catalog.php' },
],
```

## Directory Structure Reference

```
/rental_Sample/                    ← Base href points here
├── index.php                      ← href="index.php"
├── assets/images/                 ← src="assets/images/..."
├── shared/css/                    ← href="shared/css/..."
├── shared/js/                     ← src="shared/js/..."
├── client/
│   ├── auth/login.php            ← href="client/auth/login.php"
│   ├── dashboard/dashboard.php   ← href="client/dashboard/dashboard.php"
│   ├── catalog/catalog.php       ← href="client/catalog/catalog.php"
│   └── ...
├── admin/
│   ├── auth/login.php            ← href="admin/auth/login.php"
│   ├── dashboard/dashboard.php   ← href="admin/dashboard/dashboard.php"
│   └── ...
└── pages/
    ├── aboutus.php               ← href="pages/aboutus.php"
    ├── contactus.php             ← href="pages/contactus.php"
    └── ...
```

## Quick Checklist

Before committing code, search for these patterns and fix any found:

```bash
# PowerShell commands to find problematic paths
Select-String -Path "**/*.js" -Pattern 'href="/client/' 
Select-String -Path "**/*.js" -Pattern 'href="/admin/'
Select-String -Path "**/*.js" -Pattern 'href="/pages/'
Select-String -Path "**/*.js" -Pattern "location.href = '/"
Select-String -Path "**/*.js" -Pattern 'location.href = `/'
Select-String -Path "**/*.php" -Pattern 'href="/client/'
Select-String -Path "**/*.php" -Pattern 'href="/admin/'
```

## External Links

For external URLs (outside this project), use full URLs:
```html
<a href="https://facebook.com">Facebook</a>
<a href="tel:+639123456789">Call Us</a>
<a href="mailto:support@rentit.com">Email Us</a>
```

## Summary

| Scenario | Format | Example |
|----------|--------|---------|
| Internal page link | Relative | `href="client/catalog/catalog.php"` |
| Image source | Relative | `src="assets/images/logo.png"` |
| JS redirect | Relative | `window.location.href = 'admin/dashboard/dashboard.php'` |
| External link | Full URL | `href="https://example.com"` |
| Base href | Absolute | `<base href="/rental_Sample/">` (this one IS absolute) |

---

*Last updated: February 2026*
