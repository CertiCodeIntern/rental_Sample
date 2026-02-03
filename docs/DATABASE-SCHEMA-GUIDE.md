# 📊 RentIt Database Schema Guide

> **Quick Reference**: This document explains all database tables, their purposes, and relationships in the RentIt rental system.

---

## 📋 Summary (TL;DR)

### Client-Side Tables
| Category | Tables | Purpose |
|----------|--------|---------|
| **Core Users** | `users`, `addresses` | User accounts & delivery locations |
| **Products** | `categories`, `products` | Rental equipment catalog |
| **Orders** | `orders`, `order_items` | Rental transactions & line items |
| **Booking** | `reservations`, `extensions`, `returns` | Availability, extend rentals, return handling |
| **Shopping** | `cart_items`, `favorites` | Cart & wishlist functionality |
| **Engagement** | `reviews`, `notifications` | User feedback & alerts |
| **Fees** | `late_fees` | Late return penalties |

### Admin-Side Tables
| Category | Tables | Purpose |
|----------|--------|---------|
| **Access Control** | `admin_roles`, `admin_permissions`, `admin_role_permissions`, `admin_user_roles` | Role-based permissions |
| **Operations** | `admin_dispatch`, `admin_repairs` | Delivery & equipment maintenance |
| **Scheduling** | `admin_staff_schedule`, `admin_calendar_events` | Staff schedules & calendar |
| **System** | `admin_settings`, `admin_notifications`, `admin_inventory_log`, `admin_reports` | Configuration & tracking |
| **Audit** | `activity_log` | Audit trail for actions |

**Total: 15 Client Tables + 12 Admin Tables + 6 Views = 33 Database Objects**

---

## 🗂️ CLIENT-SIDE TABLES

### 1. `users`
**Purpose**: Stores all user accounts (customers and admins)

| Key Columns | Description |
|-------------|-------------|
| `role` | `customer` or `admin` |
| `status` | `active`, `inactive`, `suspended` |
| `email_verified` | Email confirmation status |
| `last_login` | Tracks user activity |

**Used by**: Login, registration, profile pages

---

### 2. `addresses`
**Purpose**: Stores user delivery/pickup addresses

| Key Columns | Description |
|-------------|-------------|
| `user_id` | Links to user |
| `label` | e.g., "Home", "Office" |
| `is_default` | Primary address flag |
| `contact_person/phone` | Delivery contact info |

**Used by**: Checkout, returns scheduling

---

### 3. `categories`
**Purpose**: Product categories for organizing equipment

| Key Columns | Description |
|-------------|-------------|
| `slug` | URL-friendly name |
| `icon` | Category emoji/icon |
| `parent_id` | For sub-categories |
| `sort_order` | Display ordering |

**Categories**: Karaoke Systems, Speakers, Microphones, Lighting, Accessories, Party Packages

---

### 4. `products`
**Purpose**: All rental equipment/items

| Key Columns | Description |
|-------------|-------------|
| `sku` | Unique product code |
| `daily_rate`, `weekly_rate`, `monthly_rate` | Pricing options |
| `deposit_amount` | Security deposit required |
| `quantity` / `available_quantity` | Inventory tracking |
| `status` | `available`, `rented`, `maintenance`, `retired` |
| `featured` | Homepage featured flag |
| `rating_avg` / `rating_count` | Review statistics |
| `specifications` | JSON field for specs |

**Used by**: Catalog, item description, cart

---

### 5. `orders`
**Purpose**: Main rental transactions/bookings

| Key Columns | Description |
|-------------|-------------|
| `order_number` | Unique order ID (e.g., ORD-2026-0001) |
| `subtotal`, `service_fee`, `delivery_fee`, `discount` | Pricing breakdown |
| `total_amount` | Final amount charged |
| `status` | Order lifecycle (see below) |
| `payment_status` | `pending`, `paid`, `partial`, `refunded` |
| `rental_start` / `rental_end` | Booking dates |
| `delivery_address_id` | Where to deliver |

**Order Status Flow**:
```
pending → confirmed → processing → dispatched → delivered → rented → returning → returned → completed
                                                                         ↓
                                                                    cancelled
```

**Used by**: My Rentals, Booking History, Admin Orders

---

### 6. `order_items`
**Purpose**: Individual items within an order (line items)

| Key Columns | Description |
|-------------|-------------|
| `order_id` | Parent order |
| `product_id` | Which product |
| `daily_rate` | Rate at time of order |
| `rental_days` | Duration |
| `subtotal` | Item total |
| `status` | `pending`, `rented`, `extended`, `returned`, `damaged` |
| `condition_before/after` | Equipment condition notes |
| `damage_fee` | If damaged |

**Used by**: Order details, returns inspection

---

### 7. `reservations`
**Purpose**: Future bookings that block product availability

| Key Columns | Description |
|-------------|-------------|
| `product_id` | Reserved product |
| `start_date` / `end_date` | Reserved period |
| `status` | `pending`, `confirmed`, `cancelled`, `completed` |
| `order_id` | Links to order when confirmed |

**Used by**: Calendar, availability checker, booking validation

---

### 8. `extensions`
**Purpose**: Rental extension requests (extend rental period)

| Key Columns | Description |
|-------------|-------------|
| `order_item_id` | Which rental item |
| `original_end_date` | Current end date |
| `new_end_date` | Requested end date |
| `extension_days` | Number of extra days |
| `extension_fee` | Additional cost |
| `status` | `pending`, `approved`, `rejected`, `paid` |

**Used by**: Returns & Extensions page, Admin approvals

---

### 9. `returns`
**Purpose**: Return requests and pickup scheduling

| Key Columns | Description |
|-------------|-------------|
| `order_id` | Which order to return |
| `return_number` | Unique return ID (e.g., RET-2026-0001) |
| `pickup_date` | Scheduled pickup date |
| `pickup_time_slot` | `morning`, `afternoon`, `evening` |
| `equipment_condition` | `excellent`, `good`, `damaged` |
| `status` | `scheduled`, `in_transit`, `picked_up`, `inspected`, `completed`, `cancelled` |
| `damage_fee` | If equipment damaged |

**Used by**: Returns page, Admin dispatch

---

### 10. `cart_items`
**Purpose**: Shopping cart for users

| Key Columns | Description |
|-------------|-------------|
| `user_id` | Cart owner |
| `product_id` | Item in cart |
| `quantity` | How many |
| `rental_start` / `rental_end` | Planned rental dates |

**Constraint**: One entry per user-product combination

**Used by**: Cart page, checkout

---

### 11. `favorites`
**Purpose**: User's wishlist/saved items

| Key Columns | Description |
|-------------|-------------|
| `user_id` | Who saved it |
| `product_id` | Saved product |

**Used by**: Favorites page, quick-add from catalog

---

### 12. `reviews`
**Purpose**: Product ratings and reviews

| Key Columns | Description |
|-------------|-------------|
| `rating` | 1-5 stars |
| `title` | Review headline |
| `comment` | Full review text |
| `is_verified` | Rented and returned |
| `is_approved` | Admin moderation |
| `helpful_count` | Upvotes |

**Used by**: Item description, admin moderation

---

### 13. `notifications`
**Purpose**: User notifications/alerts

| Key Columns | Description |
|-------------|-------------|
| `type` | `order`, `payment`, `return`, `extension`, `promotion`, `system` |
| `title` | Notification headline |
| `message` | Full message |
| `link` | Where to navigate |
| `is_read` | Read/unread status |

**Used by**: Notification bell, notification page

---

### 14. `late_fees`
**Purpose**: Track late return penalties

| Key Columns | Description |
|-------------|-------------|
| `order_id` | Which order was late |
| `days_late` | How many days overdue |
| `daily_late_fee` | Fee per day |
| `total_fee` | Total penalty |
| `status` | `pending`, `paid`, `waived` |

**Used by**: Admin late fees page, customer billing

---

### 15. `activity_log`
**Purpose**: Audit trail for important actions

| Key Columns | Description |
|-------------|-------------|
| `user_id` | Who did it |
| `action` | What happened (e.g., `order_created`) |
| `entity_type` / `entity_id` | What was affected |
| `old_values` / `new_values` | JSON change tracking |
| `ip_address` | Security tracking |

**Used by**: Admin reporting, security audits

---

## 👁️ Database Views

### `v_active_rentals`
Shows all currently active rentals with customer info and days remaining.

### `v_product_availability`
Shows all products with their availability status and inventory counts.

### `v_upcoming_reservations`
Shows future reservations with days until start date.

---

## 🔗 Key Relationships

```
users
  ├── addresses (1:many)
  ├── orders (1:many)
  │     ├── order_items (1:many)
  │     │     └── extensions (1:many)
  │     └── returns (1:1)
  ├── cart_items (1:many)
  ├── favorites (1:many)
  ├── reviews (1:many)
  ├── notifications (1:many)
  └── reservations (1:many)

categories
  └── products (1:many)
        ├── order_items (1:many)
        ├── cart_items (1:many)
        ├── favorites (1:many)
        ├── reviews (1:many)
        └── reservations (1:many)
```

---

## 🔐 Sample Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@rentit.com | password | Super Admin |
| staff@rentit.com | password | Staff |
| john@example.com | password | Customer |
| jane@example.com | password | Customer |

---

## 🛠️ ADMIN-SIDE TABLES

### 16. `admin_roles`
**Purpose**: Define admin role types for access control

| Key Columns | Description |
|-------------|-------------|
| `role_name` | Unique role identifier (super_admin, manager, staff, support) |
| `description` | What this role can do |
| `is_active` | Enable/disable role |

**Roles**: super_admin, manager, staff, support

---

### 17. `admin_permissions`
**Purpose**: Define all available permissions in the system

| Key Columns | Description |
|-------------|-------------|
| `permission_key` | Unique key (e.g., `orders.view`, `dispatch.assign`) |
| `permission_name` | Human-readable name |
| `module` | Which module (dashboard, orders, dispatch, etc.) |

**Modules**: dashboard, orders, dispatch, inventory, customers, returns, repairs, latefees, calendar, reports, settings, users

---

### 18. `admin_role_permissions`
**Purpose**: Links roles to permissions (many-to-many)

| Key Columns | Description |
|-------------|-------------|
| `role_id` | Which role |
| `permission_id` | Which permission |

**Used by**: Permission checking on every admin action

---

### 19. `admin_user_roles`
**Purpose**: Assigns roles to admin users

| Key Columns | Description |
|-------------|-------------|
| `user_id` | Which admin user |
| `role_id` | Which role they have |
| `assigned_by` | Who assigned this role |

**Used by**: Login, permission validation

---

### 20. `admin_settings`
**Purpose**: System-wide configuration settings

| Key Columns | Description |
|-------------|-------------|
| `setting_key` | Unique setting identifier |
| `setting_value` | The value (text) |
| `setting_type` | `string`, `number`, `boolean`, `json` |
| `category` | Group (business, rental, delivery, notifications, payment) |
| `is_public` | Show to customers? |

**Categories**:
- **business**: name, email, phone, address
- **rental**: min/max days, late fees, deposits
- **delivery**: fees, time slots, service areas
- **notifications**: email/SMS toggles, thresholds
- **payment**: accepted methods, account numbers

**Used by**: Settings page, checkout, various validations

---

### 21. `admin_dispatch`
**Purpose**: Track deliveries and pickups

| Key Columns | Description |
|-------------|-------------|
| `dispatch_number` | Unique ID (e.g., DSP-2026-0001) |
| `dispatch_type` | `delivery`, `pickup`, `return_pickup` |
| `assigned_staff_id` | Who handles this |
| `scheduled_date/time_slot` | When |
| `driver_name/phone` | Driver info |
| `status` | `pending` → `assigned` → `in_transit` → `completed` |
| `proof_photo` | Delivery confirmation photo |
| `customer_signature` | Signature capture |

**Dispatch Status Flow**:
```
pending → assigned → in_transit → completed
                          ↓
                       failed → rescheduled
```

**Used by**: Dispatch page, calendar

---

### 22. `admin_repairs`
**Purpose**: Track equipment repairs and maintenance

| Key Columns | Description |
|-------------|-------------|
| `repair_number` | Unique ID (e.g., REP-2026-0001) |
| `product_id` | Which equipment |
| `repair_type` | `damage`, `maintenance`, `upgrade`, `cleaning` |
| `priority` | `low`, `medium`, `high`, `urgent` |
| `assigned_to` | Technician |
| `status` | `reported` → `diagnosed` → `in_progress` → `completed` |
| `parts_cost/labor_cost/total_cost` | Costs tracking |
| `before_photos/after_photos` | Documentation |

**Repair Status Flow**:
```
reported → diagnosed → in_progress → completed
                ↓
          waiting_parts
```

**Used by**: Repairs page, inventory alerts

---

### 23. `admin_staff_schedule`
**Purpose**: Staff work schedules for calendar

| Key Columns | Description |
|-------------|-------------|
| `staff_id` | Which staff member |
| `schedule_date` | Which day |
| `shift_start/shift_end` | Work hours |
| `shift_type` | `morning`, `afternoon`, `evening`, `full_day` |
| `max_dispatches` | How many deliveries can handle |
| `is_available` | Available for dispatch |

**Used by**: Calendar, dispatch assignment

---

### 24. `admin_calendar_events`
**Purpose**: Calendar events (meetings, reminders, etc.)

| Key Columns | Description |
|-------------|-------------|
| `event_type` | `meeting`, `reminder`, `maintenance`, `delivery`, `pickup` |
| `start_datetime/end_datetime` | Event timing |
| `all_day` | Full day event? |
| `color` | Calendar color |
| `is_recurring` | Repeating event |
| `recurrence_rule` | Repeat pattern |
| `assigned_to` | JSON array of user IDs |
| `reminder_minutes` | Reminder before event |

**Used by**: Admin calendar page

---

### 25. `admin_notifications`
**Purpose**: Admin-specific notifications (separate from customer)

| Key Columns | Description |
|-------------|-------------|
| `recipient_id` | Specific admin user |
| `recipient_role_id` | Or all users with this role |
| `type` | `order`, `return`, `extension`, `repair`, `inventory`, `payment`, `system`, `alert` |
| `priority` | `low`, `normal`, `high`, `urgent` |
| `related_entity_type/id` | Link to relevant record |
| `expires_at` | Auto-dismiss after date |

**Used by**: Admin notification bell, dashboard alerts

---

### 26. `admin_inventory_log`
**Purpose**: Track all inventory changes (audit trail)

| Key Columns | Description |
|-------------|-------------|
| `product_id` | Which product |
| `action_type` | `stock_in`, `stock_out`, `adjustment`, `damage`, `retired`, `rented`, `returned` |
| `quantity_change` | +/- how many |
| `quantity_before/after` | Before and after values |
| `reference_type/id` | Related order/repair |
| `reason` | Why this change |
| `performed_by` | Who did it |

**Used by**: Inventory reports, audit trail

---

### 27. `admin_reports`
**Purpose**: Saved/scheduled report configurations

| Key Columns | Description |
|-------------|-------------|
| `report_type` | `sales`, `inventory`, `customers`, `rentals`, `returns`, `financial` |
| `parameters` | JSON filters/options |
| `schedule` | `none`, `daily`, `weekly`, `monthly` |
| `last_generated` | When last run |
| `file_path` | Saved report file |

**Used by**: Reports page, scheduled jobs

---

## 👁️ Database Views

### Client Views
| View | Purpose |
|------|---------|
| `v_active_rentals` | Active rentals with customer info and days remaining |
| `v_product_availability` | Products with availability status |
| `v_upcoming_reservations` | Future reservations with countdown |

### Admin Views
| View | Purpose |
|------|---------|
| `v_admin_dispatch_schedule` | Dispatch schedule with full details |
| `v_admin_repairs_overview` | Repairs with product and assignee info |
| `v_admin_today_schedule` | Today's dispatches and events combined |

---

## 🔗 Key Relationships

```
users
  ├── addresses (1:many)
  ├── orders (1:many)
  │     ├── order_items (1:many)
  │     │     └── extensions (1:many)
  │     ├── returns (1:1)
  │     └── admin_dispatch (1:many)
  ├── cart_items (1:many)
  ├── favorites (1:many)
  ├── reviews (1:many)
  ├── notifications (1:many)
  ├── reservations (1:many)
  └── [if admin]
        ├── admin_user_roles (1:many)
        ├── admin_staff_schedule (1:many)
        └── admin_notifications (1:many)

categories
  └── products (1:many)
        ├── order_items (1:many)
        ├── cart_items (1:many)
        ├── favorites (1:many)
        ├── reviews (1:many)
        ├── reservations (1:many)
        ├── admin_repairs (1:many)
        └── admin_inventory_log (1:many)

admin_roles
  ├── admin_role_permissions (1:many)
  │     └── admin_permissions (many:1)
  ├── admin_user_roles (1:many)
  └── admin_notifications (1:many)
```

---

## 📁 SQL Files

| File | Contents |
|------|----------|
| `database-schema.sql` | Client tables + sample data |
| `admin-tables-schema.sql` | Admin tables + sample data |

**Import Order**:
1. First: `database-schema.sql` (creates users, products, orders)
2. Then: `admin-tables-schema.sql` (creates admin tables, references users)

---

## 📝 Notes

- All tables use `InnoDB` engine for foreign key support
- Timestamps use `CURRENT_TIMESTAMP` for automatic tracking
- JSON fields store complex data (gallery, specifications, parameters)
- Indexes on frequently queried columns for performance
- Admin tables have `admin_` prefix for easy identification
