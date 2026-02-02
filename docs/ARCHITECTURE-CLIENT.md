# 🛒 RentIt - Client Portal Architecture

> **Complete guide to the Customer-facing application**  
> Last Updated: February 2, 2026 | Version: 2.5.0

---

## 📋 Overview

The **Client Portal** is the customer-facing interface where users can:
- Browse and search videoke equipment catalog
- Add items to cart and complete bookings
- Manage their active rentals
- Request returns and extensions
- View booking history

---

## 🎯 User Personas

| Persona | Description | Primary Goals |
|---------|-------------|---------------|
| **Casual Renter** | First-time or occasional user | Quick browse, easy booking |
| **Event Planner** | Books multiple items for events | Bulk booking, date flexibility |
| **Repeat Customer** | Regular renter | Favorites, quick re-book |

---

## 📁 Directory Structure

```
client/
├── 📄 dashboard.html              # Main entry point after login
│
├── 📁 auth/                       # Authentication
│   ├── 📄 login.html              # Login & Registration
│   ├── 📁 css/
│   │   └── auth.css
│   └── 📁 js/
│       └── auth.js
│
├── 📁 dashboard/                  # Dashboard (Welcome page)
│   ├── 📄 dashboard.css
│   ├── 📄 dashboard.js
│   └── 📄 README-dashboard.md
│
├── 📁 catalog/                    # Equipment Catalog
│   ├── 📄 catalog.html            # Browse all equipment
│   ├── 📄 catalog.css
│   ├── 📄 catalog.js
│   ├── 📄 itemdescription.html    # Single item detail
│   ├── 📄 itemdescription.css
│   └── 📄 itemdescription.js
│
├── 📁 cart/                       # Shopping Cart
│   ├── 📄 cart.html
│   ├── 📄 cart.css
│   └── 📄 cart.js
│
├── 📁 checkout/                   # Checkout Process
│   ├── 📄 checkout.html
│   ├── 📄 checkout.css
│   └── 📄 checkout.js
│
├── 📁 myrentals/                  # Active Rentals
│   ├── 📄 myrentals.html
│   ├── 📄 myrentals.css
│   └── 📄 myrentals.js
│
├── 📁 bookinghistory/             # Past Bookings
│   ├── 📄 bookinghistory.html
│   ├── 📄 bookinghistory.css
│   └── 📄 bookinghistory.js
│
├── 📁 favorites/                  # Saved Items
│   ├── 📄 favorites.html
│   ├── 📄 favorites.css
│   └── 📄 favorites.js
│
└── 📁 returns/                    # Return Requests
    ├── 📄 returns.html
    ├── 📄 returns.css
    └── 📄 returns.js
```

---

## 🔄 User Flows

### Flow 1: First-Time User Journey

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FIRST-TIME USER FLOW                            │
└─────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
    │ Landing  │────▶│ Register │────▶│  Login   │────▶│Dashboard │
    │  Page    │     │  Account │     │          │     │ (Welcome)│
    └──────────┘     └──────────┘     └──────────┘     └──────────┘
                                                              │
                                                              ▼
    ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
    │ Booking  │◀────│ Checkout │◀────│   Cart   │◀────│  Catalog │
    │ Complete │     │ (Payment)│     │ (Review) │     │ (Browse) │
    └──────────┘     └──────────┘     └──────────┘     └──────────┘
```

### Flow 2: Browsing & Booking

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         BOOKING FLOW                                     │
└─────────────────────────────────────────────────────────────────────────┘

    User Action                          System Response
    ═══════════                          ═══════════════
    
    1. Browse Catalog ──────────────────▶ Display available items
                                          with pricing & availability
                                          
    2. Click Item ──────────────────────▶ Show item details:
                                          • Specifications
                                          • Pricing tiers
                                          • Date picker
                                          • Add to Cart button
                                          
    3. Select Dates ────────────────────▶ Check availability
                                          Calculate total price
                                          
    4. Add to Cart ─────────────────────▶ Update cart count
                                          Show confirmation
                                          
    5. View Cart ───────────────────────▶ Display all items
                                          Show subtotal
                                          Option to remove/edit
                                          
    6. Proceed to Checkout ─────────────▶ Delivery address form
                                          Payment method
                                          Order summary
                                          
    7. Confirm Booking ─────────────────▶ Create booking record
                                          Send confirmation email
                                          Notify admin system
                                          Redirect to My Rentals
```

### Flow 3: Managing Active Rentals

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         RENTAL MANAGEMENT FLOW                           │
└─────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │    My Rentals    │
                    │   (Active List)  │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       ┌──────────┐   ┌──────────┐   ┌──────────┐
       │  Extend  │   │  Return  │   │   View   │
       │  Rental  │   │  Request │   │  Details │
       └──────────┘   └──────────┘   └──────────┘
              │              │              │
              ▼              ▼              ▼
       ┌──────────┐   ┌──────────┐   ┌──────────┐
       │ Additional│  │ Schedule │   │  Booking │
       │  Payment  │  │  Pickup  │   │  History │
       └──────────┘   └──────────┘   └──────────┘
```

---

## 📍 Page Specifications

### 1. Dashboard (`/client/dashboard.html`)
**Purpose:** Welcome screen with quick overview

**Content:**
- Welcome message with user name
- Active rentals summary (cards)
- Quick action buttons
- Upcoming returns reminder
- Recommended items

### 2. Catalog (`/client/catalog/catalog.html`)
**Purpose:** Browse all available equipment

**Features:**
- Grid/List view toggle
- Search bar
- Category filters (Karaoke Systems, Speakers, Microphones)
- Price range filter
- Availability filter
- Sort by (Price, Popularity, Name)

### 3. Item Description (`/client/catalog/itemdescription.html`)
**Purpose:** Detailed product view

**Content:**
- Product images (gallery)
- Name, model, description
- Pricing table (daily, weekly, monthly)
- Specifications
- Date picker for rental period
- Availability calendar
- Add to Cart / Add to Favorites buttons
- Similar items section

### 4. Cart (`/client/cart/cart.html`)
**Purpose:** Review selections before checkout

**Content:**
- Item list with quantities
- Rental dates per item
- Individual prices
- Subtotal calculation
- Remove/Edit buttons
- Continue Shopping link
- Proceed to Checkout button

### 5. Checkout (`/client/checkout/checkout.html`)
**Purpose:** Complete the booking

**Steps:**
1. **Delivery Information**
   - Address form
   - Delivery date/time preference
2. **Payment Method**
   - Cash on Delivery
   - GCash
   - Bank Transfer
3. **Order Review**
   - Final summary
   - Terms acceptance
4. **Confirmation**
   - Order ID
   - Receipt

### 6. My Rentals (`/client/myrentals/myrentals.html`)
**Purpose:** View and manage active rentals

**Content:**
- Active rental cards
- Status indicators (Pending, Confirmed, In Transit, Active, Due Soon)
- Extend rental button
- Request return button
- View order details

### 7. Booking History (`/client/bookinghistory/bookinghistory.html`)
**Purpose:** View past bookings

**Content:**
- Completed rentals list
- Filter by date range
- Download receipt
- Rebook same items
- Leave review

### 8. Favorites (`/client/favorites/favorites.html`)
**Purpose:** Saved items for later

**Content:**
- Saved items grid
- Quick add to cart
- Remove from favorites
- Availability status

### 9. Returns (`/client/returns/returns.html`)
**Purpose:** Request item returns

**Content:**
- Pending returns list
- Schedule pickup form
- Return status tracking
- Damage report (if any)

---

## 🎨 UI Components

### Navigation (Sidebar)
```
┌─────────────────────┐
│ 🏠 Dashboard        │  ◀── Active indicator
│ 📦 Browse Catalog   │
│ ❤️ Favorites        │
│ 🛒 My Cart (3)      │  ◀── Badge for count
│ 🎤 My Rentals       │
│ 📅 Booking History  │
│ 💬 Contact Us       │
└─────────────────────┘
│                     │
│ [User Avatar]       │
│ John Doe            │
│ Customer            │
└─────────────────────┘
```

### Status Badges
| Status | Color | Description |
|--------|-------|-------------|
| Pending | Yellow | Awaiting admin confirmation |
| Confirmed | Blue | Booking confirmed |
| In Transit | Blue | Being delivered |
| Active | Green | Currently rented |
| Due Soon | Orange | Return due within 24hrs |
| Completed | Gray | Returned |
| Overdue | Red | Past return date |

---

## 🔐 Authentication States

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         AUTH STATE MACHINE                               │
└─────────────────────────────────────────────────────────────────────────┘

           ┌──────────────┐
           │  LOGGED OUT  │
           └──────┬───────┘
                  │
                  │ Login/Register
                  ▼
           ┌──────────────┐
           │  LOGGED IN   │
           └──────┬───────┘
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐
   │ Browse  │ │ Book    │ │ Manage  │
   │ (Read)  │ │ (Write) │ │ Rentals │
   └─────────┘ └─────────┘ └─────────┘
```

---

## 📊 Data Models (Frontend)

### User Object
```javascript
{
    id: "USR-001",
    name: "John Doe",
    email: "john@example.com",
    phone: "+63 912 345 6789",
    address: "123 Main St, Makati City",
    role: "Customer",
    avatar: null
}
```

### Booking Object
```javascript
{
    id: "BK-2847",
    userId: "USR-001",
    items: [
        {
            itemId: "KRK-001",
            name: "Karaoke System Pro",
            quantity: 1,
            pricePerDay: 500,
            startDate: "2026-02-01",
            endDate: "2026-02-03",
            subtotal: 1500
        }
    ],
    status: "Active",
    deliveryAddress: "123 Main St, Makati",
    deliveryDate: "2026-02-01",
    totalAmount: 1500,
    paymentMethod: "GCash",
    paymentStatus: "Paid",
    createdAt: "2026-01-28T10:30:00Z"
}
```

---

## 🔗 Related Documentation

- [Admin Architecture](./ARCHITECTURE-ADMIN.md)
- [Master Architecture](./ARCHITECTURE-RENTIT.md)
- [CSS Architecture](./CSS-ARCHITECTURE.md)

---

**© 2026 CertiCode | RentIt Videoke Rentals**
