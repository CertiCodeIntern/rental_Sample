# RentIt System Architecture Guide

> **Version:** 1.0  
> **Last Updated:** February 3, 2026  
> **Purpose:** Complete backend implementation reference

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Technology Stack](#2-technology-stack)
3. [Database Architecture](#3-database-architecture)
4. [API Architecture](#4-api-architecture)
5. [Business Logic Flows](#5-business-logic-flows)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [Frontend-Backend Integration](#7-frontend-backend-integration)
8. [Error Handling](#8-error-handling)
9. [Conventional Commits](#9-conventional-commits)

---

## 1. System Overview

### 1.1 What is RentIt?

RentIt is a **videoke/karaoke equipment rental system** with two portals:
- **Client Portal** (`/client/`) - Customers browse, rent, extend, and return equipment
- **Admin Portal** (`/admin/`) - Staff manage inventory, orders, customers, and operations

### 1.2 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (PHP + JS)                       │
├─────────────────────────────────────────────────────────────────┤
│  Client Portal          │           Admin Portal                 │
│  ├── Catalog            │           ├── Dashboard                │
│  ├── Cart               │           ├── Orders Management        │
│  ├── Checkout           │           ├── Inventory                │
│  ├── My Rentals         │           ├── Customers                │
│  ├── Returns/Extensions │           ├── Dispatch                 │
│  ├── Booking History    │           ├── Returns/Late Fees        │
│  └── Profile            │           └── Settings                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND API (PHP)                         │
├─────────────────────────────────────────────────────────────────┤
│  /backend/api/                                                   │
│  ├── auth/        → Authentication endpoints                     │
│  ├── products/    → Product CRUD & availability                  │
│  ├── orders/      → Order management                             │
│  ├── cart/        → Shopping cart operations                     │
│  ├── extensions/  → Rental extension requests                    │
│  ├── returns/     → Return scheduling                            │
│  ├── users/       → User management                              │
│  └── admin/       → Admin-only endpoints                         │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     DATABASE (MySQL)                             │
├─────────────────────────────────────────────────────────────────┤
│  rental_system                                                   │
│  ├── users, addresses                                            │
│  ├── categories, products                                        │
│  ├── orders, order_items                                         │
│  ├── reservations (availability blocking)                        │
│  ├── extensions, returns                                         │
│  ├── cart_items, favorites                                       │
│  ├── reviews, notifications                                      │
│  └── late_fees, activity_log                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | PHP, HTML5, CSS3, JavaScript | Server-side rendering + interactivity |
| Styling | CSS Custom Properties | Theming (light/dark mode) |
| Backend | PHP 8.x | API endpoints, business logic |
| Database | MySQL 8.x | Data persistence |
| Server | Apache (XAMPP) | Local development |
| Auth | PHP Sessions + JWT (optional) | User authentication |

---

## 3. Database Architecture

### 3.1 Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │───┐   │  categories │       │  products   │
├─────────────┤   │   ├─────────────┤       ├─────────────┤
│ id (PK)     │   │   │ id (PK)     │◄──────│ category_id │
│ full_name   │   │   │ name        │       │ id (PK)     │
│ email       │   │   │ slug        │       │ sku         │
│ password    │   │   │ description │       │ name        │
│ role        │   │   └─────────────┘       │ daily_rate  │
│ status      │   │                         │ quantity    │
└─────────────┘   │                         │ available_qty│
      │           │                         └─────────────┘
      │           │                               │
      ▼           │                               │
┌─────────────┐   │   ┌─────────────┐            │
│  addresses  │   │   │   orders    │◄───────────┘
├─────────────┤   │   ├─────────────┤
│ id (PK)     │   └──►│ user_id(FK) │
│ user_id(FK) │       │ id (PK)     │
│ full_address│       │ order_number│
│ city        │       │ total_amount│
│ is_default  │       │ status      │
└─────────────┘       │ rental_start│
                      │ rental_end  │
                      └─────────────┘
                            │
          ┌─────────────────┼─────────────────┐
          ▼                 ▼                 ▼
   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
   │ order_items │   │ extensions  │   │  returns    │
   ├─────────────┤   ├─────────────┤   ├─────────────┤
   │ order_id(FK)│   │order_item_id│   │ order_id(FK)│
   │ product_id  │   │ extension_  │   │ pickup_date │
   │ quantity    │   │   _days     │   │ time_slot   │
   │ daily_rate  │   │ extension_  │   │ condition   │
   │ subtotal    │   │   _fee      │   │ status      │
   └─────────────┘   └─────────────┘   └─────────────┘

┌─────────────┐   ┌─────────────┐
│reservations │   │  favorites  │
├─────────────┤   ├─────────────┤
│ product_id  │   │ user_id(FK) │
│ user_id     │   │ product_id  │
│ start_date  │   └─────────────┘
│ end_date    │
│ status      │   ┌─────────────┐
└─────────────┘   │ cart_items  │
                  ├─────────────┤
                  │ user_id(FK) │
                  │ product_id  │
                  │ rental_start│
                  │ rental_end  │
                  └─────────────┘
```

### 3.2 Key Relationships

| Parent | Child | Relationship | Purpose |
|--------|-------|--------------|---------|
| users | orders | 1:N | User places many orders |
| users | addresses | 1:N | User has multiple addresses |
| orders | order_items | 1:N | Order contains multiple items |
| products | order_items | 1:N | Product appears in many orders |
| products | reservations | 1:N | Product has future bookings |
| order_items | extensions | 1:N | Item can be extended multiple times |
| orders | returns | 1:1 | Order has one return request |

### 3.3 Critical Tables Explained

#### **reservations** - Availability Blocking
```sql
-- This table is CRITICAL for the extend logic
-- Every confirmed rental creates a reservation that blocks the product

-- When checking if extension is available:
SELECT * FROM reservations 
WHERE product_id = ? 
  AND status IN ('pending', 'confirmed')
  AND start_date > CURRENT_DATE
  AND start_date <= ?  -- proposed new end date
ORDER BY start_date ASC
LIMIT 1;

-- If a row is returned, extension conflicts with future booking
```

#### **orders.status** - Order State Machine
```
pending → confirmed → processing → dispatched → delivered → rented → returning → returned → completed
                                                    │
                                                    └──→ cancelled (from any state before 'rented')
```

---

## 4. API Architecture

### 4.1 Directory Structure

```
backend/
├── api/
│   ├── auth/
│   │   ├── login.php          POST /api/auth/login
│   │   ├── register.php       POST /api/auth/register
│   │   ├── logout.php         POST /api/auth/logout
│   │   └── me.php             GET  /api/auth/me
│   │
│   ├── products/
│   │   ├── index.php          GET  /api/products
│   │   ├── show.php           GET  /api/products/{id}
│   │   ├── availability.php   GET  /api/products/{id}/availability
│   │   └── search.php         GET  /api/products/search
│   │
│   ├── cart/
│   │   ├── index.php          GET  /api/cart
│   │   ├── add.php            POST /api/cart/add
│   │   ├── update.php         PUT  /api/cart/update
│   │   └── remove.php         DELETE /api/cart/remove
│   │
│   ├── orders/
│   │   ├── index.php          GET  /api/orders
│   │   ├── show.php           GET  /api/orders/{id}
│   │   ├── create.php         POST /api/orders (checkout)
│   │   └── cancel.php         POST /api/orders/{id}/cancel
│   │
│   ├── extensions/
│   │   ├── check.php          POST /api/extensions/check
│   │   └── create.php         POST /api/extensions/create
│   │
│   ├── returns/
│   │   ├── index.php          GET  /api/returns
│   │   └── create.php         POST /api/returns/create
│   │
│   └── admin/
│       ├── dashboard.php      GET  /api/admin/dashboard
│       ├── orders/            CRUD for orders
│       ├── products/          CRUD for products
│       └── users/             CRUD for users
│
├── config/
│   ├── database.php           Database connection
│   └── cors.php               CORS headers
│
├── helpers/
│   ├── response.php           JSON response helpers
│   ├── validation.php         Input validation
│   └── auth.php               Authentication helpers
│
└── models/
    ├── User.php
    ├── Product.php
    ├── Order.php
    └── ...
```

### 4.2 API Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": "Email is required"
    }
  }
}
```

### 4.3 HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Not logged in |
| 403 | Forbidden | No permission |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Business rule violation |
| 500 | Server Error | Unexpected errors |

---

## 5. Business Logic Flows

### 5.1 Rent Now / Checkout Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    CHECKOUT PROCESS FLOW                          │
└──────────────────────────────────────────────────────────────────┘

Step 1: ADD TO CART
────────────────────
User clicks "Rent Now" on product page
  │
  ▼
┌─────────────────────────────────────┐
│ POST /api/cart/add                  │
│ {                                   │
│   product_id: 1,                    │
│   quantity: 1,                      │
│   rental_start: "2026-02-05",       │
│   rental_end: "2026-02-07"          │
│ }                                   │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────┐
│ Backend validates:                  │
│ 1. Product exists & is active       │
│ 2. Dates are valid (start < end)    │
│ 3. Product available for dates      │
│    (check reservations table)       │
│ 4. Sufficient quantity              │
└─────────────────────────────────────┘
  │
  ▼
Insert into cart_items table


Step 2: VIEW CART
────────────────────
User navigates to cart page
  │
  ▼
┌─────────────────────────────────────┐
│ GET /api/cart                       │
│ Returns cart items with:            │
│ - Product details                   │
│ - Calculated subtotals              │
│ - Service fees                      │
│ - Total amount                      │
└─────────────────────────────────────┘


Step 3: CHECKOUT
────────────────────
User clicks "Proceed to Checkout"
  │
  ▼
┌─────────────────────────────────────┐
│ Frontend: checkout.php              │
│ - Select/add delivery address       │
│ - Choose payment method             │
│ - Review order summary              │
│ - Agree to terms                    │
└─────────────────────────────────────┘
  │
  ▼
User clicks "Place Order"
  │
  ▼
┌─────────────────────────────────────┐
│ POST /api/orders/create             │
│ {                                   │
│   address_id: 1,                    │
│   payment_method: "gcash",          │
│   delivery_notes: "...",            │
│   promo_code: "RENTIT20"            │
│ }                                   │
└─────────────────────────────────────┘
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ Backend Process (TRANSACTION):                                   │
│                                                                  │
│ 1. BEGIN TRANSACTION                                             │
│                                                                  │
│ 2. Re-validate all cart items availability                       │
│    (someone might have booked while user was checking out)       │
│                                                                  │
│ 3. Calculate totals:                                             │
│    - Subtotal = Σ(daily_rate × days × quantity)                 │
│    - Service fee = subtotal × 5%                                 │
│    - Delivery fee = based on address                             │
│    - Discount = apply promo code if valid                        │
│    - Total = subtotal + service_fee + delivery_fee - discount    │
│    - Deposit = Σ(product deposit amounts)                        │
│                                                                  │
│ 4. Create order record (status: 'pending')                       │
│                                                                  │
│ 5. Create order_items records                                    │
│                                                                  │
│ 6. Create reservations for each item (status: 'pending')         │
│    ⚠️ This blocks the product for these dates                    │
│                                                                  │
│ 7. Clear cart_items for this user                                │
│                                                                  │
│ 8. Create notification for user                                  │
│                                                                  │
│ 9. COMMIT TRANSACTION                                            │
│                                                                  │
│ 10. Return order details with payment instructions               │
└─────────────────────────────────────────────────────────────────┘


Step 4: PAYMENT
────────────────────
For GCash/PayMaya:
  │
  ▼
Redirect to payment gateway OR show QR code
  │
  ▼
Payment webhook updates order:
- order.payment_status = 'paid'
- order.status = 'confirmed'
- reservation.status = 'confirmed'

For Cash on Delivery:
- order stays 'pending' until admin confirms
- Admin manually updates after receiving payment
```

### 5.2 Extension Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    EXTENSION PROCESS FLOW                         │
└──────────────────────────────────────────────────────────────────┘

User clicks "Extend" on active rental
  │
  ▼
Navigate to extendform.php?id={rental_id}
  │
  ▼
┌─────────────────────────────────────┐
│ Load rental details                 │
│ GET /api/orders/{id}                │
│ - Current end date                  │
│ - Product info                      │
│ - Daily rate                        │
└─────────────────────────────────────┘
  │
  ▼
User selects extension duration (e.g., 3 days)
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ CHECK AVAILABILITY                                               │
│ POST /api/extensions/check                                       │
│ {                                                                │
│   order_item_id: 1,                                              │
│   extension_days: 3                                              │
│ }                                                                │
│                                                                  │
│ Backend Logic:                                                   │
│                                                                  │
│ 1. Get current rental end date                                   │
│    current_end = "2026-01-31"                                    │
│                                                                  │
│ 2. Calculate proposed new end date                               │
│    new_end = current_end + 3 days = "2026-02-03"                 │
│                                                                  │
│ 3. Check for conflicting reservations                            │
│    SELECT * FROM reservations                                    │
│    WHERE product_id = ?                                          │
│      AND id != current_reservation_id                            │
│      AND status IN ('pending', 'confirmed')                      │
│      AND start_date <= new_end                                   │
│      AND start_date > current_end                                │
│    ORDER BY start_date ASC                                       │
│                                                                  │
│ 4. If conflict found:                                            │
│    - Calculate max available days                                │
│    - Return: available = false, max_days = X,                    │
│              next_reservation_date = "2026-02-08"                │
│                                                                  │
│ 5. If no conflict:                                               │
│    - Calculate extension fee                                     │
│    - Return: available = true, fee = ₱1,575,                    │
│              new_end_date = "2026-02-03"                         │
└─────────────────────────────────────────────────────────────────┘
  │
  ▼
Display availability status to user
  │
  ▼
If available, user clicks "Confirm Extension"
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ CREATE EXTENSION                                                 │
│ POST /api/extensions/create                                      │
│ {                                                                │
│   order_item_id: 1,                                              │
│   extension_days: 3                                              │
│ }                                                                │
│                                                                  │
│ Backend Process (TRANSACTION):                                   │
│                                                                  │
│ 1. Re-validate availability (double-check)                       │
│                                                                  │
│ 2. Create extension record (status: 'pending')                   │
│                                                                  │
│ 3. Update reservation end_date                                   │
│                                                                  │
│ 4. Update order rental_end date                                  │
│                                                                  │
│ 5. Create notification for admin                                 │
│                                                                  │
│ 6. Return extension details with payment info                    │
└─────────────────────────────────────────────────────────────────┘
```

### 5.3 Return Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                    RETURN PROCESS FLOW                            │
└──────────────────────────────────────────────────────────────────┘

User clicks "Return" on active rental
  │
  ▼
Navigate to returnform.php?id={rental_id}
  │
  ▼
User fills return form:
- Pickup date (tomorrow to 7 days)
- Time slot (morning/afternoon/evening)
- Pickup address
- Equipment condition
- Damage notes (if damaged)
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ CREATE RETURN REQUEST                                            │
│ POST /api/returns/create                                         │
│ {                                                                │
│   order_id: 1,                                                   │
│   pickup_date: "2026-02-01",                                     │
│   pickup_time_slot: "morning",                                   │
│   pickup_address_id: 1,                                          │
│   equipment_condition: "excellent",                              │
│   damage_notes: null,                                            │
│   additional_notes: "Gate code: 1234"                            │
│ }                                                                │
│                                                                  │
│ Backend Process:                                                 │
│                                                                  │
│ 1. Validate order belongs to user                                │
│ 2. Validate order status is 'rented'                             │
│ 3. Generate return_number (RET-2026-XXX)                         │
│ 4. Create return record (status: 'scheduled')                    │
│ 5. Update order status to 'returning'                            │
│ 6. Create notifications (user + admin)                           │
│ 7. Return confirmation details                                   │
└─────────────────────────────────────────────────────────────────┘


Admin Pickup Process:
  │
  ▼
Admin views scheduled returns in dispatch page
  │
  ▼
Admin marks as "Picked Up"
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ Process:                                                         │
│ 1. Update return status: 'picked_up'                             │
│ 2. Inspect equipment condition                                   │
│ 3. If damaged: calculate damage_fee, update return record        │
│ 4. Update return status: 'inspected'                             │
│ 5. Update order status: 'returned'                               │
│ 6. Update product available_quantity += quantity                 │
│ 7. Check if return is late:                                      │
│    - If actual_return > rental_end: create late_fee record       │
│ 8. Complete return: status = 'completed'                         │
│ 9. Complete order: status = 'completed'                          │
│ 10. Process deposit refund (minus any fees)                      │
└─────────────────────────────────────────────────────────────────┘
```

### 5.4 Availability Check Algorithm

```php
/**
 * Check if a product is available for given dates
 * 
 * @param int $productId
 * @param string $startDate
 * @param string $endDate
 * @param int $quantity
 * @param int|null $excludeReservationId - For extensions, exclude current reservation
 * @return array ['available' => bool, 'reason' => string|null]
 */
function checkAvailability($productId, $startDate, $endDate, $quantity = 1, $excludeReservationId = null) {
    // 1. Get product info
    $product = getProduct($productId);
    if (!$product || $product['status'] !== 'available') {
        return ['available' => false, 'reason' => 'Product not available'];
    }
    
    // 2. Count overlapping reservations
    $sql = "SELECT SUM(quantity) as reserved_qty 
            FROM reservations r
            JOIN order_items oi ON r.order_id = oi.order_id AND r.product_id = oi.product_id
            WHERE r.product_id = ?
              AND r.status IN ('pending', 'confirmed')
              AND r.start_date < ?
              AND r.end_date > ?";
    
    if ($excludeReservationId) {
        $sql .= " AND r.id != ?";
    }
    
    $reservedQty = executeQuery($sql, [$productId, $endDate, $startDate, $excludeReservationId]);
    
    // 3. Calculate available quantity
    $availableQty = $product['quantity'] - $reservedQty;
    
    if ($availableQty < $quantity) {
        return [
            'available' => false, 
            'reason' => 'Insufficient quantity',
            'available_qty' => $availableQty
        ];
    }
    
    return ['available' => true];
}
```

---

## 6. Authentication & Authorization

### 6.1 Session-Based Auth Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOGIN PROCESS                                 │
└─────────────────────────────────────────────────────────────────┘

POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password"
}
  │
  ▼
┌─────────────────────────────────────┐
│ Backend:                            │
│ 1. Validate input                   │
│ 2. Find user by email               │
│ 3. Verify password (password_verify)│
│ 4. Check user status is 'active'    │
│ 5. Create session:                  │
│    $_SESSION['user_id'] = $user->id │
│    $_SESSION['role'] = $user->role  │
│ 6. Update last_login timestamp      │
│ 7. Log activity                     │
│ 8. Return user data (no password)   │
└─────────────────────────────────────┘
  │
  ▼
Frontend stores minimal user data in localStorage
for UI purposes (name, role for display)
```

### 6.2 Auth Middleware

```php
// helpers/auth.php

function requireAuth() {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'error' => ['code' => 'UNAUTHORIZED', 'message' => 'Please login']
        ]);
        exit;
    }
    return $_SESSION['user_id'];
}

function requireAdmin() {
    $userId = requireAuth();
    if ($_SESSION['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode([
            'success' => false,
            'error' => ['code' => 'FORBIDDEN', 'message' => 'Admin access required']
        ]);
        exit;
    }
    return $userId;
}

function getCurrentUser() {
    session_start();
    return $_SESSION['user_id'] ?? null;
}
```

### 6.3 Role-Based Access

| Endpoint Pattern | Customer | Admin |
|-----------------|----------|-------|
| `/api/auth/*` | ✅ | ✅ |
| `/api/products/*` | ✅ (read) | ✅ (CRUD) |
| `/api/cart/*` | ✅ | ❌ |
| `/api/orders/*` | ✅ (own) | ✅ (all) |
| `/api/extensions/*` | ✅ (own) | ✅ (all) |
| `/api/returns/*` | ✅ (own) | ✅ (all) |
| `/api/admin/*` | ❌ | ✅ |

---

## 7. Frontend-Backend Integration

### 7.1 API Service Pattern

```javascript
// shared/js/api.js

const API_BASE = '/rental_Sample/backend/api';

const API = {
    /**
     * Make authenticated API request
     */
    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            credentials: 'include', // Include session cookies
            ...options
        };
        
        if (options.body && typeof options.body === 'object') {
            config.body = JSON.stringify(options.body);
        }
        
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new APIError(data.error?.message || 'Request failed', data.error?.code);
            }
            
            return data;
        } catch (error) {
            if (error instanceof APIError) throw error;
            throw new APIError('Network error', 'NETWORK_ERROR');
        }
    },
    
    // Auth
    auth: {
        login: (email, password) => API.request('/auth/login.php', {
            method: 'POST',
            body: { email, password }
        }),
        logout: () => API.request('/auth/logout.php', { method: 'POST' }),
        me: () => API.request('/auth/me.php')
    },
    
    // Products
    products: {
        list: (params) => API.request(`/products/index.php?${new URLSearchParams(params)}`),
        get: (id) => API.request(`/products/show.php?id=${id}`),
        checkAvailability: (id, start, end) => 
            API.request(`/products/availability.php?id=${id}&start=${start}&end=${end}`)
    },
    
    // Cart
    cart: {
        get: () => API.request('/cart/index.php'),
        add: (productId, startDate, endDate, quantity = 1) => API.request('/cart/add.php', {
            method: 'POST',
            body: { product_id: productId, rental_start: startDate, rental_end: endDate, quantity }
        }),
        update: (itemId, data) => API.request('/cart/update.php', {
            method: 'PUT',
            body: { item_id: itemId, ...data }
        }),
        remove: (itemId) => API.request(`/cart/remove.php?id=${itemId}`, { method: 'DELETE' })
    },
    
    // Orders
    orders: {
        list: () => API.request('/orders/index.php'),
        get: (id) => API.request(`/orders/show.php?id=${id}`),
        create: (data) => API.request('/orders/create.php', { method: 'POST', body: data }),
        cancel: (id, reason) => API.request(`/orders/cancel.php`, {
            method: 'POST',
            body: { order_id: id, reason }
        })
    },
    
    // Extensions
    extensions: {
        check: (orderItemId, days) => API.request('/extensions/check.php', {
            method: 'POST',
            body: { order_item_id: orderItemId, extension_days: days }
        }),
        create: (orderItemId, days) => API.request('/extensions/create.php', {
            method: 'POST',
            body: { order_item_id: orderItemId, extension_days: days }
        })
    },
    
    // Returns
    returns: {
        list: () => API.request('/returns/index.php'),
        create: (data) => API.request('/returns/create.php', { method: 'POST', body: data })
    }
};

class APIError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
```

### 7.2 Form Integration Example

```javascript
// client/checkout/checkout.js

async function handleCheckout(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Processing...';
    
    try {
        const formData = {
            address_id: form.address.value,
            payment_method: form.payment.value,
            delivery_notes: form.notes.value,
            promo_code: form.promo_code?.value || null
        };
        
        const response = await API.orders.create(formData);
        
        if (response.success) {
            // Show success modal
            showOrderConfirmation(response.data.order);
            
            // Redirect to order details after delay
            setTimeout(() => {
                window.location.href = `client/bookinghistory/bookinghistory.php?order=${response.data.order.id}`;
            }, 3000);
        }
    } catch (error) {
        showNotification(error.message, 'error');
        
        if (error.code === 'AVAILABILITY_CHANGED') {
            // Refresh cart to show updated availability
            loadCart();
        }
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Place Order';
    }
}
```

---

## 8. Error Handling

### 8.1 Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `UNAUTHORIZED` | 401 | Not logged in |
| `FORBIDDEN` | 403 | No permission |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `PRODUCT_UNAVAILABLE` | 409 | Product not available for dates |
| `AVAILABILITY_CHANGED` | 409 | Availability changed during checkout |
| `EXTENSION_CONFLICT` | 409 | Extension conflicts with reservation |
| `INVALID_ORDER_STATUS` | 409 | Cannot perform action on order |
| `PAYMENT_REQUIRED` | 402 | Payment needed |
| `SERVER_ERROR` | 500 | Unexpected server error |

### 8.2 Error Response Helper

```php
// helpers/response.php

function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function successResponse($data, $message = 'Success', $statusCode = 200) {
    jsonResponse([
        'success' => true,
        'data' => $data,
        'message' => $message
    ], $statusCode);
}

function errorResponse($code, $message, $details = null, $statusCode = 400) {
    jsonResponse([
        'success' => false,
        'error' => [
            'code' => $code,
            'message' => $message,
            'details' => $details
        ]
    ], $statusCode);
}
```

---

## 9. Conventional Commits

### 9.1 Commit Message Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### 9.2 Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(checkout): add promo code validation` |
| `fix` | Bug fix | `fix(cart): correct quantity calculation` |
| `docs` | Documentation | `docs(api): add endpoint documentation` |
| `style` | Code style (no logic change) | `style(css): format button styles` |
| `refactor` | Code refactoring | `refactor(auth): extract validation logic` |
| `perf` | Performance improvement | `perf(products): add database indexing` |
| `test` | Add/update tests | `test(orders): add checkout unit tests` |
| `chore` | Maintenance tasks | `chore(deps): update dependencies` |
| `build` | Build system changes | `build(docker): add production config` |
| `ci` | CI/CD changes | `ci(github): add deployment workflow` |

### 9.3 Scopes

| Scope | Description |
|-------|-------------|
| `auth` | Authentication system |
| `cart` | Shopping cart |
| `checkout` | Checkout process |
| `orders` | Order management |
| `products` | Product catalog |
| `extensions` | Rental extensions |
| `returns` | Return system |
| `admin` | Admin panel |
| `client` | Client portal |
| `api` | Backend API |
| `db` | Database |
| `ui` | User interface |
| `config` | Configuration |

### 9.4 Examples

```bash
# Feature commits
feat(checkout): implement order creation API
feat(extensions): add availability conflict detection
feat(returns): create pickup scheduling form
feat(auth): add password reset functionality

# Fix commits
fix(cart): prevent duplicate items with same dates
fix(extensions): handle edge case for same-day extensions
fix(api): return proper error codes for validation

# Refactor commits
refactor(orders): extract pricing calculation to service
refactor(api): implement repository pattern for products

# Documentation commits
docs(api): add Swagger documentation for endpoints
docs(readme): update installation instructions

# Database commits
feat(db): add reservations table for availability
fix(db): add index on reservations for performance
chore(db): add sample data for testing

# Multi-line commit example
feat(checkout): implement complete order flow

- Add cart validation before checkout
- Calculate service fee and delivery fee
- Create reservations to block availability
- Clear cart after successful order
- Send order confirmation notification

Closes #42
```

### 9.5 Breaking Changes

```bash
feat(api)!: change order response format

BREAKING CHANGE: The order response now includes nested 
order_items instead of a flat structure.

Before:
{ order_id: 1, items: [1, 2, 3] }

After:
{ order_id: 1, items: [{ id: 1, product: {...} }] }
```

---

## Quick Reference Card

### API Endpoints Summary

```
Auth:
  POST   /api/auth/login          - Login
  POST   /api/auth/register       - Register  
  POST   /api/auth/logout         - Logout
  GET    /api/auth/me             - Get current user

Products:
  GET    /api/products            - List products
  GET    /api/products/{id}       - Get product
  GET    /api/products/{id}/availability - Check availability

Cart:
  GET    /api/cart                - Get cart
  POST   /api/cart/add            - Add to cart
  PUT    /api/cart/update         - Update cart item
  DELETE /api/cart/remove         - Remove from cart

Orders:
  GET    /api/orders              - List user's orders
  GET    /api/orders/{id}         - Get order details
  POST   /api/orders              - Create order (checkout)
  POST   /api/orders/{id}/cancel  - Cancel order

Extensions:
  POST   /api/extensions/check    - Check extension availability
  POST   /api/extensions/create   - Request extension

Returns:
  GET    /api/returns             - List return requests
  POST   /api/returns/create      - Schedule return pickup
```

### Order Status Flow

```
pending → confirmed → processing → dispatched → delivered → rented → returning → returned → completed
```

### Key Business Rules

1. **Availability**: A product is available if `available_quantity > 0` AND no conflicting reservations exist
2. **Extensions**: Can only extend if no other reservations start before the proposed new end date
3. **Returns**: Can only schedule returns for orders with status `rented`
4. **Late Fees**: Applied when `actual_return_date > rental_end`
5. **Deposits**: Refunded after return inspection minus any damage fees

---

*This document serves as the complete reference for implementing the RentIt backend system.*
