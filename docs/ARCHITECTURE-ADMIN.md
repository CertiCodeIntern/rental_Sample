# 👨‍💼 RentIt - Admin Dashboard Architecture

> **Complete guide to the Staff-facing administration portal**  
> Last Updated: February 2, 2026 | Version: 2.5.0

---

## 📋 Overview

The **Admin Dashboard** is the staff-facing interface for managing:
- Order processing and fulfillment
- Dispatch and delivery scheduling
- Customer management
- Inventory and equipment status
- Late fees and penalties
- Repairs and maintenance

### ⚠️ Key Principle
> **Admins RECEIVE and MANAGE orders - they do NOT create bookings.**  
> All bookings originate from the Client Portal. Admin's role is to:
> - Review and confirm incoming orders
> - Coordinate delivery/pickup (dispatch)
> - Track rental status
> - Handle returns, repairs, and fees

---

## 🎯 Admin User Roles

| Role | Permissions | Primary Tasks |
|------|-------------|---------------|
| **Super Admin** | Full access | System config, user management |
| **Manager** | Most access | Approve orders, manage staff |
| **Staff** | Limited access | Process orders, dispatch |
| **Viewer** | Read-only | View reports |

---

## 📁 Directory Structure

```
admin/
├── 📄 README-admin.md             # Admin documentation
│
├── 📁 auth/                       # Admin Authentication
│   ├── 📄 login.php              # Admin login page
│   ├── 📁 css/
│   │   └── auth.css
│   └── 📁 js/
│       └── auth.js
│
├── 📁 dashboard/                  # Main Dashboard
│   ├── 📄 dashboard.php          # KPIs, recent activity
│   ├── 📁 css/
│   │   └── dashboard-new.css
│   └── 📁 js/
│       └── dashboard.js
│
├── 📁 orders/                     # Order Management
│   ├── 📄 orders.php             # All orders list
│   ├── 📄 orderdetail.php        # Single order detail
│   ├── 📄 orders.css
│   └── 📄 orders.js
│
├── 📁 dispatch/                   # Dispatch Management
│   ├── 📄 dispatch.php           # Delivery/pickup scheduling
│   ├── 📄 dispatch.css
│   └── 📄 dispatch.js
│
├── 📁 customers/                  # Customer Management
│   ├── 📄 customers.php          # Customer database
│   ├── 📄 customers.css
│   └── 📄 customers.js
│
├── 📁 calendar/                   # Calendar Master View
│   ├── 📄 calendar.php           # Visual availability grid
│   ├── 📄 calendar.css
│   └── 📄 calendar.js
│
├── 📁 repairs/                    # Repairs & Maintenance
│   ├── 📄 repairs.php
│   ├── 📄 repairs.css
│   └── 📄 repairs.js
│
├── 📁 latefees/                   # Late Fees Tracker
│   ├── 📄 latefees.php
│   ├── 📄 latefees.css
│   └── 📄 latefees.js
│
├── 📁 settings/                   # System Settings
│   ├── 📄 settings.php
│   ├── 📄 settings.css
│   └── 📄 settings.js
│
└── 📁 shared/                     # Admin Shared Resources
    ├── 📁 css/
    │   ├── admin-theme.css        # Admin color palette (dark/light)
    │   ├── admin-globals.css      # Base styles, utilities
    │   └── admin-components.css   # UI components
    └── 📁 js/
        └── admin-components.js    # Sidebar, header, footer, utils
```

---

## 🔄 Admin Workflows

### Workflow 1: Order Processing (Primary Flow)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ORDER PROCESSING WORKFLOW                             │
└─────────────────────────────────────────────────────────────────────────┘

    Customer Portal                      Admin Dashboard
    ═══════════════                      ═══════════════
    
    Client submits booking ─────────────▶ NEW ORDER appears on Dashboard
                                          with status: "Pending"
                                          
                                          ┌─────────────────────┐
                                          │ Admin reviews order │
                                          │ • Customer info     │
                                          │ • Items requested   │
                                          │ • Dates & delivery  │
                                          │ • Payment method    │
                                          └──────────┬──────────┘
                                                     │
                                          ┌──────────┴──────────┐
                                          ▼                     ▼
                                    ┌──────────┐          ┌──────────┐
                                    │ CONFIRM  │          │  REJECT  │
                                    │  Order   │          │  (Reason)│
                                    └────┬─────┘          └──────────┘
                                         │
                                         ▼
                                    ┌──────────┐
                                    │ ASSIGN   │
                                    │ Dispatch │
                                    └────┬─────┘
                                         │
                                         ▼
    Notification sent ◀─────────────── Status: "Confirmed"
```

### Workflow 2: Dispatch Management

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    DISPATCH WORKFLOW                                     │
└─────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────┐
                    │    DISPATCH DASHBOARD   │
                    │    (Today's Schedule)   │
                    └───────────┬─────────────┘
                                │
         ┌──────────────────────┼──────────────────────┐
         ▼                      ▼                      ▼
    ┌──────────┐          ┌──────────┐          ┌──────────┐
    │ DELIVERY │          │  PICKUP  │          │  SWAP    │
    │ (Drop-off)│         │ (Return) │          │ (Exchange)│
    └────┬─────┘          └────┬─────┘          └────┬─────┘
         │                     │                     │
         ▼                     ▼                     ▼
    ┌──────────────────────────────────────────────────────┐
    │                  UPDATE ORDER STATUS                  │
    │  Pending → In Transit → Delivered/Picked Up          │
    └──────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │     ORDER DETAIL        │
                    │  (Full order info)      │
                    └─────────────────────────┘
```

### Workflow 3: Return & Inspection

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    RETURN WORKFLOW                                       │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │ Pickup Item  │
    │ from Customer│
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐     ┌────────────────────────────────────────┐
    │   INSPECT    │────▶│  Condition Assessment:                 │
    │   Equipment  │     │  ✓ Good → Available for next rental   │
    └──────────────┘     │  ⚠ Cleaning needed → Mark for cleaning │
                         │  ✗ Damaged → Send to Repairs           │
                         │  💰 Fees apply → Create Late Fee       │
                         └────────────────────────────────────────┘
```

### Workflow 4: Late Fee Handling

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    LATE FEE WORKFLOW                                     │
└─────────────────────────────────────────────────────────────────────────┘

    System auto-checks rental dates daily
                    │
                    ▼
    ┌──────────────────────────────────────┐
    │  Rental overdue by X days?           │
    │  YES → Create Late Fee Record        │
    │  Calculate: (Days × Daily Rate × %)  │
    └──────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────┐
    │  Late Fee Tracker shows all overdue  │
    │  Admin can:                          │
    │  • Send reminder to customer         │
    │  • Waive fee (with reason)          │
    │  • Mark as paid                     │
    │  • Escalate                         │
    └──────────────────────────────────────┘
```

---

## 📍 Page Specifications

### 1. Dashboard (`/admin/dashboard/dashboard.php`)
**Purpose:** Overview of business operations

**KPI Cards:**
- Total Revenue (this month)
- Active Rentals (current)
- Pending Deliveries (today)
- Machines Available (inventory)

**Sections:**
- Recent Orders (table with quick actions)
- Today's Schedule (timeline)
- Inventory Health (progress bars)
- Quick Actions (navigation shortcuts)

### 2. Orders (`/admin/orders/orders.php`)
**Purpose:** List and manage all orders

**Features:**
- Filter by status (Pending, Confirmed, In Transit, Active, Completed)
- Search by booking ID, customer name
- Sort by date, amount
- Bulk actions (confirm multiple)
- Quick status update

**Table Columns:**
| Column | Description |
|--------|-------------|
| Order ID | BK-XXXX format |
| Customer | Name with avatar |
| Items | Equipment count |
| Dates | Rental period |
| Amount | Total payment |
| Status | Badge |
| Payment | Paid/Pending |
| Actions | View, Dispatch |

### 3. Order Detail (`/admin/orders/orderdetail.php`)
**Purpose:** Full order information

**Sections:**
- **Order Header:** ID, status, dates
- **Customer Info:** Name, contact, address, history
- **Items List:** Equipment details, quantities, pricing
- **Delivery Info:** Address, scheduled date/time, driver
- **Payment:** Method, status, amount, transaction ID
- **Timeline:** Order history (created, confirmed, dispatched, etc.)
- **Actions:** Update status, print receipt, contact customer

### 4. Dispatch (`/admin/dispatch/dispatch.php`)
**Purpose:** Manage deliveries and pickups

**View Options:**
- **Card View:** Visual dispatch cards
- **Timeline View:** Daily schedule

**Dispatch Card Contains:**
- Order ID
- Customer name & address
- Items (summarized)
- Time slot
- Type (Delivery/Pickup)
- Status (Pending, In Transit, Completed)
- Click → Navigate to Order Detail

**Filters:**
- Today / Tomorrow / This Week
- Type: Deliveries, Pickups, Both
- Status: Pending, In Transit, Completed

### 5. Customers (`/admin/customers/customers.php`)
**Purpose:** Customer database and history

**KPI Cards:**
- Total Customers
- Active Bookings
- Monthly Revenue from Customers
- Overdue Returns

**Table Columns:**
| Column | Description |
|--------|-------------|
| Customer | Avatar, name |
| Booking ID | Latest booking |
| Items | What they're renting |
| Date | Rental dates |
| Status | Current booking status |
| Payment | Payment status |
| Actions | View, Edit |

**Customer Detail (Modal/Page):**
- Profile information
- Contact details
- Booking history
- Total spend
- Notes

### 6. Calendar (`/admin/calendar/calendar.php`)
**Purpose:** Visual availability and booking overview

**Features:**
- Month/Week/Day views
- Equipment rows with booking blocks
- Color coding by status
- Click to view booking detail
- Drag to reschedule (optional)

### 7. Repairs (`/admin/repairs/repairs.php`)
**Purpose:** Manage equipment maintenance

**Status Workflow:**
```
Reported → In Repair → Testing → Available
```

**Table Columns:**
- Equipment ID
- Item Name
- Issue Description
- Reported Date
- Priority (Low/Medium/High)
- Status
- Actions

### 8. Late Fees (`/admin/latefees/latefees.php`)
**Purpose:** Track and manage overdue rentals

**Filters:**
- Outstanding / Paid / Waived
- Days Overdue (1-3, 4-7, 7+)

**Table Columns:**
- Booking ID
- Customer
- Item
- Due Date
- Days Overdue
- Fee Amount
- Status
- Actions (Remind, Waive, Mark Paid)

### 9. Settings (`/admin/settings/settings.php`)
**Purpose:** System configuration

**Sections:**
- Business Info (name, address, contact)
- Pricing Configuration
- Late Fee Rules
- Notification Templates
- User Management (admin accounts)
- Theme Preferences

---

## 🧭 Sidebar Navigation

```
┌─────────────────────────┐
│ 🏠 Dashboard            │  ◀── Overview
├─────────────────────────┤
│ 📋 Orders               │  ◀── All bookings
│ 📅 Calendar             │  ◀── Visual scheduler
│ 🚚 Dispatch             │  ◀── Delivery/pickup
├─────────────────────────┤
│ 👥 Customers            │  ◀── Customer database
├─────────────────────────┤
│ 🔧 Repairs              │  ◀── Maintenance
│ 💰 Late Fees            │  ◀── Overdue tracking
├─────────────────────────┤
│ ⚙️ Settings             │  ◀── Configuration
└─────────────────────────┘
│                         │
│ [Admin Avatar]          │
│ Admin User              │
│ Administrator           │
└─────────────────────────┘
```

---

## 📊 Status Definitions

### Order Status
| Status | Description | Color |
|--------|-------------|-------|
| Pending | New order, awaiting review | Yellow |
| Confirmed | Admin approved | Blue |
| In Transit | Being delivered | Blue |
| Active | Currently rented | Green |
| Due Soon | Return due within 24hrs | Orange |
| Overdue | Past return date | Red |
| Completed | Returned successfully | Gray |
| Cancelled | Order cancelled | Gray |

### Payment Status
| Status | Description | Color |
|--------|-------------|-------|
| Pending | Awaiting payment | Yellow |
| Paid | Payment received | Green |
| Partial | Partial payment | Orange |
| Refunded | Money returned | Gray |
| Failed | Payment failed | Red |

### Equipment Status
| Status | Description | Color |
|--------|-------------|-------|
| Available | Ready for rental | Green |
| Rented | Currently with customer | Blue |
| Reserved | Booked for future | Blue |
| In Repair | Under maintenance | Red |
| Cleaning | Being cleaned | Purple |
| Retired | No longer in use | Gray |

---

## 🔐 Authentication & Authorization

### Login Flow
```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Admin Login  │────▶│  Validate    │────▶│  Dashboard   │
│    Page      │     │  Credentials │     │   (Home)     │
└──────────────┘     └──────────────┘     └──────────────┘
```

### Session Management
- Token stored in localStorage (`admin-token`)
- Theme preference stored in localStorage (`admin-theme`)
- Sidebar state stored in localStorage (`admin-sidebar-collapsed`)

---

## 📈 Data Models

### Order Object
```javascript
{
    id: "BK-2847",
    customerId: "USR-001",
    customerName: "Sarah Johnson",
    customerPhone: "+63 912 345 6789",
    customerEmail: "sarah@example.com",
    deliveryAddress: "123 Main St, Makati City",
    items: [
        {
            itemId: "KRK-001",
            name: "Karaoke System Pro",
            quantity: 1,
            pricePerDay: 500
        }
    ],
    rentalStart: "2026-02-01",
    rentalEnd: "2026-02-03",
    totalAmount: 1500,
    paymentMethod: "GCash",
    paymentStatus: "Paid",
    orderStatus: "Active",
    dispatchInfo: {
        deliveryDate: "2026-02-01",
        deliveryTime: "09:00",
        driver: "Juan"
    },
    timeline: [
        { date: "2026-01-28T10:30:00Z", event: "Order created", by: "Customer" },
        { date: "2026-01-28T11:00:00Z", event: "Order confirmed", by: "Admin" },
        { date: "2026-02-01T09:30:00Z", event: "Delivered", by: "Juan" }
    ],
    createdAt: "2026-01-28T10:30:00Z"
}
```

---

## 🔗 Related Documentation

- [Client Architecture](./ARCHITECTURE-CLIENT.md)
- [Master Architecture](./ARCHITECTURE-RENTIT.md)
- [CSS Architecture](./CSS-ARCHITECTURE.md)

---

**© 2026 CertiCode | RentIt Videoke Rentals**
