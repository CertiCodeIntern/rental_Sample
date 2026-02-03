# 🏗️ RentIt - Complete Project Architecture

> **Comprehensive guide to the entire RentIt Videoke Rental System**  
> Last Updated: February 2, 2026 | Version: 2.5.0

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Directory Structure](#directory-structure)
4. [User Flows](#user-flows)
5. [Admin Flows](#admin-flows)
6. [Page Mapping](#page-mapping)
7. [Theme System](#theme-system)
8. [Component Architecture](#component-architecture)
9. [Data Flow Diagrams](#data-flow-diagrams)

---

## 🎯 Project Overview

**RentIt** is a videoke/karaoke equipment rental management system with two primary interfaces:

| Interface | Purpose | Primary Users |
|-----------|---------|---------------|
| **Client Portal** | Browse, book, and manage rentals | Customers |
| **Admin Dashboard** | Manage inventory, bookings, and operations | Staff, Managers |

### Technology Stack
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling:** CSS Custom Properties (CSS Variables) for theming
- **Deployment:** Vercel (Static hosting with rewrites)
- **Icons:** SVG inline icons
- **Fonts:** Inter (Google Fonts)

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         RENTIT SYSTEM                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐       ┌─────────────────────────────┐ │
│  │   CLIENT PORTAL     │       │      ADMIN DASHBOARD        │ │
│  │   (Customer-facing) │       │      (Staff-facing)         │ │
│  ├─────────────────────┤       ├─────────────────────────────┤ │
│  │ • Browse Catalog    │       │ • Dashboard Overview        │ │
│  │ • Add to Cart       │       │ • Calendar Master View      │ │
│  │ • Checkout/Book     │       │ • Repairs & Maintenance     │ │
│  │ • My Rentals        │       │ • Late Fees Tracker         │ │
│  │ • Booking History   │       │ • Dispatch Management       │ │
│  │ • Favorites         │       │ • Customer Management       │ │
│  │ • Returns           │       │ • Settings & Config         │ │
│  └─────────────────────┘       └─────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    SHARED RESOURCES                       │  │
│  │  • Theme System (Light/Dark)  • Global Components         │  │
│  │  • Design Tokens              • Utility Functions         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure

```
rental_Sample/
│
├── 📄 index.php                    # Landing page (entry point)
├── 📄 vercel.json                   # Deployment config with rewrites
├── 📄 README.md                     # Project readme
│
├── 📁 admin/                        # ═══ ADMIN PORTAL ═══
│   ├── 📄 dashboard.php            # Admin entry point
│   │
│   ├── 📁 auth/                     # Admin authentication
│   │   ├── 📄 login.php
│   │   ├── 📁 css/
│   │   │   └── auth.css
│   │   └── 📁 js/
│   │       └── auth.js
│   │
│   ├── 📁 dashboard/                # Main dashboard
│   │   ├── 📁 css/
│   │   │   └── dashboard.css
│   │   └── 📁 js/
│   │       └── dashboard.js
│   │
│   ├── 📁 calendar/                 # Calendar Master View
│   │   ├── 📄 calendar.php
│   │   ├── 📄 calendar.css
│   │   └── 📄 calendar.js
│   │
│   ├── 📁 repairs/                  # Repairs & Maintenance
│   │   ├── 📄 repairs.php
│   │   ├── 📄 repairs.css
│   │   └── 📄 repairs.js
│   │
│   ├── 📁 latefees/                 # Late Fees Tracker
│   │   ├── 📄 latefees.php
│   │   ├── 📄 latefees.css
│   │   └── 📄 latefees.js
│   │
│   ├── 📁 dispatch/                 # Dispatch Management
│   │   ├── 📄 dispatch.php
│   │   ├── 📄 dispatch.css
│   │   └── 📄 dispatch.js
│   │
│   ├── 📁 customers/                # Customer Management
│   │   ├── 📄 customers.php
│   │   ├── 📄 customers.css
│   │   └── 📄 customers.js
│   │
│   ├── 📁 settings/                 # Admin Settings
│   │   ├── 📄 settings.php
│   │   ├── 📄 settings.css
│   │   └── 📄 settings.js
│   │
│   └── 📁 shared/                   # Admin-specific shared
│       ├── 📁 css/
│       │   ├── admin-theme.css      # Admin color palette
│       │   ├── admin-globals.css    # Admin base styles
│       │   └── admin-components.css # Admin UI components
│       └── 📁 js/
│           └── admin-components.js  # Admin sidebar, header, utils
│
├── 📁 client/                       # ═══ CLIENT PORTAL ═══
│   ├── 📄 dashboard.php            # Client entry point
│   │
│   ├── 📁 auth/                     # Client authentication
│   ├── 📁 dashboard/                # Dashboard styles/scripts
│   ├── 📁 catalog/                  # Browse equipment
│   ├── 📁 cart/                     # Shopping cart
│   ├── 📁 checkout/                 # Booking checkout
│   ├── 📁 myrentals/                # Active rentals
│   ├── 📁 bookinghistory/           # Past bookings
│   ├── 📁 favorites/                # Saved items
│   └── 📁 returns/                  # Return management
│
├── 📁 shared/                       # ═══ SHARED RESOURCES ═══
│   ├── 📁 css/
│   │   ├── theme.css                # Theme variables (light/dark)
│   │   ├── globals.css              # Base styles, reset
│   │   └── landing.css              # Landing page styles
│   └── 📁 js/
│       ├── components.js            # Reusable components
│       ├── theme.js                 # Theme toggle logic
│       └── landing.js               # Landing page scripts
│
├── 📁 assets/                       # ═══ STATIC ASSETS ═══
│   ├── 📁 images/                   # Photos, logos
│   └── 📁 icons/                    # SVG icons
│
├── 📁 pages/                        # ═══ STATIC PAGES ═══
│   ├── 📄 about.php
│   ├── 📄 contactus.php
│   ├── 📄 terms.php
│   ├── 📄 privacy-policy.php
│   └── 📄 wip.php
│
├── 📁 landingpage/                  # Landing page assets
│   ├── 📁 css/
│   └── 📁 js/
│
├── 📁 docs/                         # ═══ DOCUMENTATION ═══
│   ├── 📄 PROJECT-ARCHITECTURE.md   # This file
│   ├── 📄 ARCHITECTURE.md           # Legacy architecture
│   ├── 📄 CSS-ARCHITECTURE.md
│   ├── 📄 CHANGELOG.md
│   └── 📁 logs/
│
├── 📁 notes/                        # Development notes
└── 📁 rules/                        # AI assistant rules
    ├── 📄 design-system.md
    └── 📄 CLAUDE-REMINDERS.md       # Claude AI guidelines
```

---

## 👤 User Flows (Client Portal)

### Flow 1: Browse & Book

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Landing    │───▶│   Login/    │───▶│  Dashboard  │───▶│   Catalog   │
│   Page      │    │  Register   │    │  (Welcome)  │    │   Browse    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                                                                │
                                                                ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Booking    │◀───│  Checkout   │◀───│    Cart     │◀───│    Item     │
│  Complete   │    │   (Pay)     │    │  (Review)   │    │   Details   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Flow 2: Manage Rentals

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Dashboard  │───▶│  My Rentals │───▶│   Extend/   │
│             │    │  (Active)   │    │   Return    │
└─────────────┘    └─────────────┘    └─────────────┘
       │
       │           ┌─────────────┐
       └──────────▶│   Booking   │
                   │   History   │
                   └─────────────┘
```

---

## 👨‍💼 Admin Flows (Admin Dashboard)

### Flow A: Daily Operations

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Admin     │───▶│  Dashboard  │───▶│  Calendar   │
│   Login     │    │  Overview   │    │ Master View │
└─────────────┘    └─────────────┘    └─────────────┘
                          │                  │
                          │                  ▼
                          │           ┌─────────────┐
                          │           │   Dispatch  │
                          │           │  Schedule   │
                          │           └─────────────┘
                          │
                          ▼
                   ┌─────────────┐    ┌─────────────┐
                   │  Late Fees  │───▶│    Send     │
                   │  Tracker    │    │  Reminders  │
                   └─────────────┘    └─────────────┘
```

### Flow B: Maintenance Operations

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  Dashboard  │───▶│   Repairs   │───▶│ Mark as     │
│             │    │  Management │    │ Repaired    │
└─────────────┘    └─────────────┘    └─────────────┘
                          │
                          ▼
                   ┌─────────────┐    ┌─────────────┐
                   │  Add New    │───▶│   Update    │
                   │  Repair     │    │  Inventory  │
                   └─────────────┘    └─────────────┘
```

---

## 📍 Page Mapping

### Admin Portal Pages

| Page | URL | Purpose |
|------|-----|---------|
| **Dashboard** | `/admin/dashboard.php` | Overview, KPIs, quick actions |
| **Calendar** | `/admin/calendar/calendar.php` | Visual booking calendar, availability |
| **Repairs** | `/admin/repairs/repairs.php` | Manage repairs, cleaning, maintenance |
| **Late Fees** | `/admin/latefees/latefees.php` | Track overdue, manage penalties |
| **Dispatch** | `/admin/dispatch/dispatch.php` | Delivery & pickup scheduling |
| **Customers** | `/admin/customers/customers.php` | Customer database, history |
| **Settings** | `/admin/settings/settings.php` | System configuration |

### Client Portal Pages

| Page | URL | Purpose |
|------|-----|---------|
| **Dashboard** | `/client/dashboard.php` | Welcome, active rentals summary |
| **Catalog** | `/client/catalog/catalog.php` | Browse available equipment |
| **Item Details** | `/client/catalog/itemdescription.php` | Product details, booking |
| **Cart** | `/client/cart/cart.php` | Review selections |
| **Checkout** | `/client/checkout/checkout.php` | Complete booking |
| **My Rentals** | `/client/myrentals/myrentals.php` | Current active rentals |
| **History** | `/client/bookinghistory/bookinghistory.php` | Past bookings |
| **Favorites** | `/client/favorites/favorites.php` | Saved items |
| **Returns** | `/client/returns/returns.php` | Request returns |

---

## 🎨 Theme System

### Color Palettes

#### Client Theme
```css
/* Primary: RentIt Blue */
--brand-primary: #013A63;
--accent: #E67E22;  /* Orange */
```

#### Admin Theme
```css
/* Primary: Deep Navy */
--admin-primary: #0F172A;
--admin-accent: #FB7012;  /* Vibrant Orange */
--admin-secondary: #1E293B;
```

### Theme Toggle
Both portals support Light/Dark mode with proper contrast ratios:
- **WCAG AA:** Minimum 4.5:1 for normal text
- **WCAG AAA:** Minimum 7:1 for enhanced accessibility

---

## 🧩 Component Architecture

### Shared Components

```javascript
// Admin Components (admin/shared/js/admin-components.js)
AdminComponents = {
    injectSidebar(containerId, activePage)
    injectHeader(containerId)
    injectFooter(containerId)
    toggleTheme()
    showModal(config)
    showToast(message, type)
}

// Client Components (shared/js/components.js)
Components = {
    injectSidebar(containerId, activeTab, context)
    injectTopbar(containerId)
    handleLogout()
    requireAuth()
}
```

---

## 📊 Data Flow Diagrams

### Booking Flow

```
Customer                    System                      Admin
    │                          │                          │
    │  1. Select Item          │                          │
    │─────────────────────────▶│                          │
    │                          │                          │
    │  2. Add to Cart          │                          │
    │─────────────────────────▶│                          │
    │                          │                          │
    │  3. Checkout             │                          │
    │─────────────────────────▶│                          │
    │                          │                          │
    │                          │  4. Booking Created      │
    │                          │─────────────────────────▶│
    │                          │                          │
    │                          │                          │  5. Review & Confirm
    │                          │◀─────────────────────────│
    │                          │                          │
    │  6. Confirmation         │                          │
    │◀─────────────────────────│                          │
    │                          │                          │
```

### Return & Maintenance Flow

```
Customer                    System                      Admin
    │                          │                          │
    │  1. Request Return       │                          │
    │─────────────────────────▶│                          │
    │                          │                          │
    │                          │  2. Schedule Pickup      │
    │                          │─────────────────────────▶│
    │                          │                          │
    │                          │                          │  3. Complete Pickup
    │                          │◀─────────────────────────│
    │                          │                          │
    │                          │  4. Inspect Item         │
    │                          │◀─────────────────────────│
    │                          │                          │
    │                          │  5a. Mark Available      │
    │                          │◀─────────────────────────│
    │                          │       OR                 │
    │                          │  5b. Send to Repairs     │
    │                          │◀─────────────────────────│
    │                          │                          │
```

---

## 🔗 Related Documentation

- [Admin Architecture](../admin/README-admin.md)
- [CSS Architecture](./CSS-ARCHITECTURE.md)
- [Changelog](./CHANGELOG.md)
- [Claude AI Reminders](../rules/CLAUDE-REMINDERS.md)

---

**© 2026 CertiCode | RentIt Videoke Rentals v2.5.0**
