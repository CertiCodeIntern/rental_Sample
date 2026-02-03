# RENTIT - Master Project Architecture

> **Version:** 1.0.0  
> **Last Updated:** January 2025  
> **Project Type:** Equipment Rental Management Platform

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Directory Structure](#directory-structure)
4. [Dual Portal System](#dual-portal-system)
5. [Data Flow Architecture](#data-flow-architecture)
6. [Shared Resources](#shared-resources)
7. [Theme System](#theme-system)
8. [Component Architecture](#component-architecture)
9. [Authentication Flow](#authentication-flow)
10. [Order Lifecycle](#order-lifecycle)
11. [Technology Stack](#technology-stack)
12. [Deployment](#deployment)

---

## 🎯 Project Overview

RENTIT is a comprehensive equipment rental management platform consisting of two interconnected portals:

### Client Portal (`/client`)
- **Purpose:** Customer-facing platform for browsing, booking, and managing equipment rentals
- **Users:** Registered customers who rent equipment
- **Documentation:** [ARCHITECTURE-CLIENT.md](./ARCHITECTURE-CLIENT.md)

### Admin Portal (`/admin`)
- **Purpose:** Staff-facing platform for managing orders, dispatch, customers, and operations
- **Users:** Business staff, managers, administrators
- **Documentation:** [ARCHITECTURE-ADMIN.md](./ARCHITECTURE-ADMIN.md)

### Key Principle
```
┌─────────────────────────────────────────────────────────────────┐
│  CLIENT creates orders → ADMIN receives & manages orders        │
│  The flow is ONE-DIRECTIONAL for order creation                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ System Architecture

```
                            RENTIT PLATFORM
    ┌───────────────────────────────────────────────────────────┐
    │                                                           │
    │   ┌─────────────────┐         ┌─────────────────┐        │
    │   │  CLIENT PORTAL  │         │  ADMIN PORTAL   │        │
    │   │   /client/*     │         │    /admin/*     │        │
    │   │                 │         │                 │        │
    │   │  • Browse       │         │  • Dashboard    │        │
    │   │  • Book         │ ──────► │  • Orders       │        │
    │   │  • Manage       │ Orders  │  • Dispatch     │        │
    │   │  • Pay          │         │  • Customers    │        │
    │   │  • Return       │ ◄────── │  • Calendar     │        │
    │   │                 │ Status  │  • Repairs      │        │
    │   └─────────────────┘ Updates │  • Late Fees    │        │
    │           │                   └─────────────────┘        │
    │           │                           │                  │
    │   ┌───────┴───────────────────────────┴───────┐          │
    │   │              SHARED RESOURCES             │          │
    │   │            /shared/* & /assets/*          │          │
    │   │                                           │          │
    │   │  • Theme System  • Global Styles          │          │
    │   │  • UI Components • Icons & Images         │          │
    │   └───────────────────────────────────────────┘          │
    │                                                           │
    └───────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure

```
rental_Sample/
│
├── index.php                    # Landing page entry point
├── vercel.json                   # Deployment configuration
│
├── admin/                        # ADMIN PORTAL
│   ├── dashboard.php            # Main admin entry (redirects)
│   ├── auth/                     # Admin authentication
│   │   ├── login.php
│   │   ├── css/auth.css
│   │   └── js/auth.js
│   ├── dashboard/                # Admin dashboard
│   │   ├── dashboard.php
│   │   ├── css/dashboard-new.css
│   │   └── js/dashboard.js
│   ├── orders/                   # Order management
│   │   ├── orders.php           # Order list
│   │   ├── orderdetail.php      # Single order view
│   │   ├── css/orders.css
│   │   └── js/orders.js
│   ├── dispatch/                 # Dispatch management
│   │   ├── dispatch.php
│   │   ├── css/dispatch.css
│   │   └── js/dispatch.js
│   ├── customers/                # Customer management
│   │   ├── customers.php
│   │   ├── css/customers.css
│   │   └── js/customers.js
│   ├── calendar/                 # Booking calendar
│   │   ├── calendar.php
│   │   ├── css/calendar.css
│   │   └── js/calendar.js
│   ├── repairs/                  # Equipment repairs
│   │   ├── repairs.php
│   │   ├── css/repairs.css
│   │   └── js/repairs.js
│   ├── latefees/                 # Late fee management
│   │   ├── latefees.php
│   │   ├── css/latefees.css
│   │   └── js/latefees.js
│   ├── settings/                 # Admin settings
│   │   ├── settings.php
│   │   ├── css/settings.css
│   │   └── js/settings.js
│   └── shared/                   # Admin shared resources
│       ├── css/
│       │   ├── admin-theme.css
│       │   ├── admin-globals.css
│       │   └── admin-components.css
│       └── js/
│           ├── admin-components.js
│           └── admin-notifications.js
│
├── client/                       # CLIENT PORTAL
│   ├── dashboard.php            # Client entry point
│   ├── auth/                     # Client authentication
│   │   ├── login.php
│   │   ├── css/auth.css
│   │   └── js/auth.js
│   ├── dashboard/                # Client dashboard
│   │   ├── dashboard.css
│   │   └── dashboard.js
│   ├── catalog/                  # Equipment browsing
│   │   ├── catalog.php
│   │   ├── catalog.css
│   │   ├── catalog.js
│   │   ├── itemdescription.php
│   │   ├── itemdescription.css
│   │   └── itemdescription.js
│   ├── cart/                     # Shopping cart
│   │   ├── cart.php
│   │   ├── cart.css
│   │   └── cart.js
│   ├── checkout/                 # Checkout process
│   │   ├── checkout.php
│   │   ├── checkout.css
│   │   └── checkout.js
│   ├── myrentals/                # Active rentals
│   │   ├── myrentals.php
│   │   ├── myrentals.css
│   │   └── myrentals.js
│   ├── bookinghistory/           # Past bookings
│   │   ├── bookinghistory.php
│   │   ├── bookinghistory.css
│   │   └── bookinghistory.js
│   ├── returns/                  # Return process
│   │   ├── returns.php
│   │   ├── returns.css
│   │   └── returns.js
│   └── favorites/                # Saved items
│       ├── favorites.php
│       ├── favorites.css
│       └── favorites.js
│
├── shared/                       # GLOBAL SHARED RESOURCES
│   ├── css/
│   │   ├── globals.css           # Base global styles
│   │   ├── theme.css             # Theme variables
│   │   └── landing.css           # Landing page styles
│   └── js/
│       ├── components.js         # Shared components
│       ├── theme.js              # Theme switching
│       └── landing.js            # Landing page logic
│
├── assets/                       # STATIC ASSETS
│   ├── icons/                    # SVG icons
│   └── images/                   # Images & photos
│
├── landingpage/                  # LANDING PAGE
│   ├── css/index.css
│   └── js/index.js
│
├── pages/                        # STATIC PAGES
│   ├── about.php
│   ├── aboutus.php
│   ├── contactus.php
│   ├── terms.php
│   ├── privacy-policy.php
│   └── cookie-policy.php
│
├── docs/                         # DOCUMENTATION
│   ├── ARCHITECTURE.md           # Legacy (deprecated)
│   ├── ARCHITECTURE-RENTIT.md    # Master architecture (this file)
│   ├── ARCHITECTURE-CLIENT.md    # Client portal docs
│   ├── ARCHITECTURE-ADMIN.md     # Admin portal docs
│   ├── CSS-ARCHITECTURE.md       # CSS standards
│   └── CHANGELOG.md              # Version history
│
├── notes/                        # DEVELOPMENT NOTES
│   ├── COMMIT_GUIDELINES.md
│   ├── CLAUDE_REVIEW.md
│   └── stepbystep-project.md
│
├── reference/                    # DESIGN REFERENCE
│   └── albert/                   # UI reference files
│
└── rules/                        # PROJECT RULES
    └── design-system.md          # Design system specs
```

---

## 🔄 Dual Portal System

### Portal Separation Philosophy

| Aspect | Client Portal | Admin Portal |
|--------|---------------|--------------|
| **URL Prefix** | `/client/*` | `/admin/*` |
| **Users** | Customers | Staff/Managers |
| **Theme Prefix** | `--client-*` (future) | `--admin-*` |
| **LocalStorage Key** | `client-theme` | `admin-theme` |
| **Component System** | `components.js` | `admin-components.js` |
| **Primary Action** | Create bookings | Manage bookings |

### Portal Communication

```
CLIENT PORTAL                           ADMIN PORTAL
─────────────                           ────────────
     │                                       │
     │  1. Customer browses catalog          │
     │  2. Customer adds to cart             │
     │  3. Customer checkouts                │
     │                                       │
     │ ══════════════════════════════════════│
     │     ORDER CREATED (Pending)           │
     │ ══════════════════════════════════════│
     │                                       │
     │                         4. Admin sees new order
     │                         5. Admin confirms order
     │                         6. Admin dispatches
     │                                       │
     │ ══════════════════════════════════════│
     │     STATUS UPDATE (Confirmed)         │
     │ ══════════════════════════════════════│
     │                                       │
     │  7. Customer sees status update       │
     │  8. Customer receives equipment       │
     │  9. Customer uses & returns           │
     │                                       │
     │ ══════════════════════════════════════│
     │     RETURN INITIATED                  │
     │ ══════════════════════════════════════│
     │                                       │
     │                         10. Admin inspects return
     │                         11. Admin processes fees
     │                         12. Admin closes order
     │                                       │
     ▼                                       ▼
```

---

## 📊 Data Flow Architecture

### Order State Machine

```
┌──────────────────────────────────────────────────────────────────┐
│                         ORDER LIFECYCLE                          │
└──────────────────────────────────────────────────────────────────┘

  CLIENT ACTION              ORDER STATUS            ADMIN ACTION
  ─────────────              ────────────            ────────────
       │                          │                      │
  [Add to Cart]                   │                      │
       │                          │                      │
       ▼                          │                      │
  [Checkout] ────────────► ┌──────────────┐              │
                           │   PENDING    │◄──── [Review Order]
                           └──────┬───────┘              │
                                  │                      │
                                  ▼              [Confirm Order]
                           ┌──────────────┐              │
                           │  CONFIRMED   │◄─────────────┘
                           └──────┬───────┘
                                  │
                                  ▼              [Schedule Delivery]
                           ┌──────────────┐              │
                           │ OUT FOR      │◄─────────────┘
                           │ DELIVERY     │
                           └──────┬───────┘
                                  │
  [Receive Equipment] ◄───────────┤              [Mark Delivered]
       │                          ▼                      │
       │               ┌──────────────┐                  │
       │               │   ACTIVE     │◄─────────────────┘
       │               │  (In Use)    │
       │               └──────┬───────┘
       │                      │
  [Initiate Return] ──────────┤
       │                      ▼              [Schedule Pickup]
       │               ┌──────────────┐              │
       │               │   RETURN     │◄─────────────┘
       │               │  SCHEDULED   │
       │               └──────┬───────┘
       │                      │
       │                      ▼              [Inspect Equipment]
       │               ┌──────────────┐              │
       │               │  RETURNED    │◄─────────────┘
       │               │ (Inspecting) │
       │               └──────┬───────┘
       │                      │
       │                      ├────────────┬───────────────┐
       │                      │            │               │
       │                      ▼            ▼               ▼
       │               ┌──────────┐ ┌───────────┐ ┌─────────────┐
       │               │ GOOD     │ │ DAMAGED   │ │ LATE        │
       │               │ CONDITION│ │ (Repairs) │ │ (Late Fees) │
       │               └────┬─────┘ └─────┬─────┘ └──────┬──────┘
       │                    │             │              │
       │                    └──────┬──────┴──────────────┘
       │                           │
       │                           ▼              [Close Order]
       │                    ┌──────────────┐              │
  [View History] ◄───────── │  COMPLETED   │◄─────────────┘
                            └──────────────┘
```

---

## 🎨 Shared Resources

### Global CSS (`/shared/css/`)

| File | Purpose | Usage |
|------|---------|-------|
| `globals.css` | Base reset & utilities | All pages |
| `theme.css` | CSS custom properties | All pages |
| `landing.css` | Landing page specific | Landing only |

### Global JS (`/shared/js/`)

| File | Purpose | Usage |
|------|---------|-------|
| `components.js` | Shared UI components | Client pages |
| `theme.js` | Theme switching logic | All pages |
| `landing.js` | Landing animations | Landing only |

### Admin-Specific (`/admin/shared/`)

| File | Purpose |
|------|---------|
| `admin-theme.css` | Admin color palette & variables |
| `admin-globals.css` | Admin base styles |
| `admin-components.css` | Sidebar, header, cards, tables |
| `admin-components.js` | Component injection (sidebar, header, footer) |
| `admin-notifications.js` | Notification dropdown logic |

---

## 🌙 Theme System

### Dual Theme Support

Both portals support light/dark themes independently:

```css
/* Theme Variables Pattern */
:root {
  /* Light theme (default) */
  --admin-bg-primary: #ffffff;
  --admin-text-primary: #1a1a2e;
}

[data-theme="dark"] {
  /* Dark theme */
  --admin-bg-primary: #1a1a2e;
  --admin-text-primary: #ffffff;
}
```

### Theme Storage

```javascript
// Admin theme
localStorage.getItem('admin-theme')  // 'light' | 'dark'

// Client theme (future)
localStorage.getItem('client-theme') // 'light' | 'dark'
```

### Theme Toggle Implementation

```javascript
// In admin-components.js
function toggleTheme() {
    const html = document.documentElement;
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', next);
    localStorage.setItem('admin-theme', next);
}
```

---

## 🧩 Component Architecture

### Admin Component Injection Pattern

```html
<!-- Page Structure -->
<body class="admin-wrapper">
    <div id="sidebarContainer"></div>
    <main class="admin-main-content">
        <div id="headerContainer"></div>
        <!-- Page Content -->
        <div id="footerContainer"></div>
    </main>
</body>

<script>
document.addEventListener('DOMContentLoaded', function() {
    AdminComponents.injectSidebar('sidebarContainer');
    AdminComponents.injectHeader('headerContainer', 'Page Title');
    AdminComponents.injectFooter('footerContainer');
});
</script>
```

### Component Methods

| Method | Parameters | Purpose |
|--------|------------|---------|
| `injectSidebar(containerId)` | Container element ID | Renders sidebar navigation |
| `injectHeader(containerId, title)` | Container ID, page title | Renders top header bar |
| `injectFooter(containerId)` | Container element ID | Renders footer |

---

## 🔐 Authentication Flow

### Login Process

```
┌─────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION FLOW                        │
└─────────────────────────────────────────────────────────────────┘

  CLIENT LOGIN                              ADMIN LOGIN
  ────────────                              ───────────
       │                                         │
  /client/auth/login.php              /admin/auth/login.php
       │                                         │
       ▼                                         ▼
  [Enter Credentials]                    [Enter Credentials]
       │                                         │
       ▼                                         ▼
  [Validate]                             [Validate]
       │                                         │
       ├─── FAIL ──► [Show Error]        ├─── FAIL ──► [Show Error]
       │                                         │
       ▼ SUCCESS                                 ▼ SUCCESS
       │                                         │
  [Store Session]                        [Store Session]
  localStorage:                          localStorage:
  - user-token                           - admin-token
  - user-data                            - admin-data
       │                                         │
       ▼                                         ▼
  /client/dashboard.php                 /admin/dashboard/dashboard.php
```

### Session Data Structure

```javascript
// Client session
{
    userId: "USR-12345",
    email: "customer@email.com",
    name: "John Doe",
    role: "customer",
    token: "jwt-token-here"
}

// Admin session
{
    adminId: "ADM-001",
    email: "admin@rentit.com",
    name: "Admin User",
    role: "admin|manager|staff",
    permissions: ["orders", "dispatch", "customers"],
    token: "jwt-token-here"
}
```

---

## 📦 Order Lifecycle

### Complete Order Object

```javascript
const order = {
    // Identification
    orderId: "ORD-2025-0142",
    bookingId: "BK-78901",
    
    // Customer
    customer: {
        id: "USR-12345",
        name: "John Doe",
        email: "john@email.com",
        phone: "+1 234 567 8900",
        avatar: "/assets/images/avatars/user.jpg"
    },
    
    // Items
    items: [
        {
            itemId: "EQ-001",
            name: "Canon EOS R5",
            category: "Cameras",
            quantity: 1,
            dailyRate: 150.00,
            image: "/assets/images/equipment/canon-r5.jpg"
        }
    ],
    
    // Dates
    dates: {
        ordered: "2025-01-28T10:30:00Z",
        startDate: "2025-01-30",
        endDate: "2025-02-02",
        duration: 3, // days
        returned: null
    },
    
    // Delivery
    delivery: {
        method: "delivery|pickup",
        address: "123 Main St, City, State 12345",
        scheduledDate: "2025-01-30",
        scheduledTime: "10:00 AM - 12:00 PM",
        driver: "Mike Johnson",
        notes: "Leave at front desk"
    },
    
    // Payment
    payment: {
        subtotal: 450.00,
        tax: 36.00,
        deliveryFee: 25.00,
        deposit: 200.00,
        discount: 0,
        total: 711.00,
        status: "pending|paid|partial|refunded",
        method: "credit_card|paypal|cash",
        paidAmount: 711.00,
        refundedAmount: 0
    },
    
    // Status
    status: {
        order: "pending|confirmed|out_for_delivery|active|return_scheduled|returned|completed|cancelled",
        equipment: "available|rented|returned|inspecting|damaged|in_repair"
    },
    
    // Timestamps
    timestamps: {
        created: "2025-01-28T10:30:00Z",
        confirmed: "2025-01-28T11:00:00Z",
        dispatched: "2025-01-30T09:00:00Z",
        delivered: "2025-01-30T10:45:00Z",
        returned: null,
        completed: null
    },
    
    // Notes & Issues
    notes: [
        {
            date: "2025-01-28T11:00:00Z",
            author: "Admin",
            text: "Order confirmed, scheduled for delivery"
        }
    ],
    
    issues: {
        hasLateFee: false,
        lateFeeAmount: 0,
        hasDamage: false,
        damageDescription: "",
        repairCost: 0
    }
};
```

---

## 🛠️ Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| HTML5 | - | Semantic markup |
| CSS3 | - | Styling & animations |
| JavaScript | ES6+ | Interactive functionality |
| CSS Custom Properties | - | Theming system |

### No Framework Philosophy

This project intentionally uses **vanilla technologies** without frameworks:
- **No React/Vue/Angular** - Plain HTML & JS
- **No Tailwind/Bootstrap** - Custom CSS architecture
- **No jQuery** - Native DOM APIs

### Benefits
1. Zero build step required
2. Minimal dependencies
3. Maximum browser compatibility
4. Easy to understand and maintain
5. Fast initial load times

---

## 🚀 Deployment

### Vercel Configuration

```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/$1" }
  ]
}
```

### Folder Deployment

```
Production URL Structure:
─────────────────────────
https://rentit.vercel.app/                    → index.php (landing)
https://rentit.vercel.app/client/dashboard    → /client/dashboard.php
https://rentit.vercel.app/admin/dashboard     → /admin/dashboard/dashboard.php
https://rentit.vercel.app/pages/about         → /pages/about.php
```

### Environment Checklist

- [ ] All relative paths work correctly
- [ ] Theme persistence works across pages
- [ ] Mobile responsive on all pages
- [ ] Dark/Light themes have proper contrast
- [ ] All navigation links functional
- [ ] Forms have proper validation
- [ ] Error states handled gracefully

---

## 📚 Related Documentation

| Document | Description |
|----------|-------------|
| [ARCHITECTURE-CLIENT.md](./ARCHITECTURE-CLIENT.md) | Client portal detailed architecture |
| [ARCHITECTURE-ADMIN.md](./ARCHITECTURE-ADMIN.md) | Admin portal detailed architecture |
| [CSS-ARCHITECTURE.md](./CSS-ARCHITECTURE.md) | CSS naming conventions & structure |
| [CHANGELOG.md](./CHANGELOG.md) | Version history & updates |
| [design-system.md](../rules/design-system.md) | Design tokens & components |

---

## 🔄 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Jan 2025 | Initial architecture documentation |

---

*This document serves as the master reference for the RENTIT platform architecture. For portal-specific details, refer to the individual architecture documents.*
