-- =====================================================
-- ADMIN TABLES - RentIt Admin Panel Database Schema
-- Additional tables for admin-side functionality
-- =====================================================

USE rental_system;

-- =====================================================
-- ADMIN_ROLES TABLE
-- Role-based access control for admin users
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_role_name (role_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ADMIN_PERMISSIONS TABLE
-- Available permissions in the system
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    permission_key VARCHAR(100) NOT NULL UNIQUE,
    permission_name VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_module (module),
    INDEX idx_permission_key (permission_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ADMIN_ROLE_PERMISSIONS TABLE
-- Links roles to their permissions (many-to-many)
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_role_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (role_id) REFERENCES admin_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (permission_id) REFERENCES admin_permissions(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_permission (role_id, permission_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ADMIN_USER_ROLES TABLE
-- Assigns roles to admin users
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_by INT,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES admin_roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_role (user_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ADMIN_SETTINGS TABLE
-- System-wide configuration settings
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    category VARCHAR(50) NOT NULL,
    description TEXT,
    is_public TINYINT(1) DEFAULT 0,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_setting_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ADMIN_DISPATCH TABLE
-- Dispatch/delivery assignments for orders
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_dispatch (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    dispatch_number VARCHAR(50) UNIQUE NOT NULL,
    dispatch_type ENUM('delivery', 'pickup', 'return_pickup') NOT NULL,
    assigned_staff_id INT,
    scheduled_date DATE NOT NULL,
    scheduled_time_slot ENUM('morning', 'afternoon', 'evening') NOT NULL,
    actual_datetime TIMESTAMP NULL,
    vehicle_info VARCHAR(100),
    driver_name VARCHAR(100),
    driver_phone VARCHAR(20),
    status ENUM('pending', 'assigned', 'in_transit', 'completed', 'failed', 'rescheduled') DEFAULT 'pending',
    failure_reason TEXT,
    customer_signature VARCHAR(255),
    proof_photo VARCHAR(255),
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_staff_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_order (order_id),
    INDEX idx_status (status),
    INDEX idx_scheduled (scheduled_date, scheduled_time_slot),
    INDEX idx_staff (assigned_staff_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ADMIN_REPAIRS TABLE
-- Equipment repair and maintenance tracking
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_repairs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    repair_number VARCHAR(50) UNIQUE NOT NULL,
    product_id INT NOT NULL,
    order_item_id INT,
    repair_type ENUM('damage', 'maintenance', 'upgrade', 'cleaning') NOT NULL,
    priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
    reported_by INT,
    assigned_to INT,
    damage_description TEXT,
    diagnosis TEXT,
    repair_actions TEXT,
    parts_used JSON,
    labor_hours DECIMAL(5,2) DEFAULT 0,
    parts_cost DECIMAL(10,2) DEFAULT 0,
    labor_cost DECIMAL(10,2) DEFAULT 0,
    total_cost DECIMAL(10,2) DEFAULT 0,
    status ENUM('reported', 'diagnosed', 'in_progress', 'waiting_parts', 'completed', 'cancelled') DEFAULT 'reported',
    start_date DATE,
    estimated_completion DATE,
    actual_completion DATE,
    before_photos JSON,
    after_photos JSON,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE SET NULL,
    FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_product (product_id),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_assigned (assigned_to)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ADMIN_STAFF_SCHEDULE TABLE
-- Staff work schedules for calendar
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_staff_schedule (
    id INT AUTO_INCREMENT PRIMARY KEY,
    staff_id INT NOT NULL,
    schedule_date DATE NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    shift_type ENUM('morning', 'afternoon', 'evening', 'full_day', 'custom') DEFAULT 'full_day',
    is_available TINYINT(1) DEFAULT 1,
    max_dispatches INT DEFAULT 5,
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_staff_date (staff_id, schedule_date),
    INDEX idx_date (schedule_date),
    INDEX idx_staff (staff_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ADMIN_CALENDAR_EVENTS TABLE
-- Admin calendar events (meetings, reminders, etc.)
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_calendar_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_type ENUM('meeting', 'reminder', 'maintenance', 'delivery', 'pickup', 'other') NOT NULL,
    start_datetime DATETIME NOT NULL,
    end_datetime DATETIME NOT NULL,
    all_day TINYINT(1) DEFAULT 0,
    location VARCHAR(255),
    color VARCHAR(20) DEFAULT '#3b82f6',
    is_recurring TINYINT(1) DEFAULT 0,
    recurrence_rule VARCHAR(255),
    related_order_id INT,
    related_product_id INT,
    created_by INT NOT NULL,
    assigned_to JSON,
    reminder_minutes INT DEFAULT 30,
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (related_order_id) REFERENCES orders(id) ON DELETE SET NULL,
    FOREIGN KEY (related_product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_dates (start_datetime, end_datetime),
    INDEX idx_type (event_type),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ADMIN_NOTIFICATIONS TABLE
-- Admin-specific notifications (separate from customer)
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipient_id INT,
    recipient_role_id INT,
    type ENUM('order', 'return', 'extension', 'repair', 'inventory', 'payment', 'system', 'alert') NOT NULL,
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255),
    related_entity_type VARCHAR(50),
    related_entity_id INT,
    is_read TINYINT(1) DEFAULT 0,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NULL,
    
    FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_role_id) REFERENCES admin_roles(id) ON DELETE CASCADE,
    INDEX idx_recipient (recipient_id, is_read),
    INDEX idx_role (recipient_role_id),
    INDEX idx_type (type),
    INDEX idx_priority (priority),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ADMIN_INVENTORY_LOG TABLE
-- Track inventory changes (stock in/out)
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_inventory_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    action_type ENUM('stock_in', 'stock_out', 'adjustment', 'damage', 'retired', 'rented', 'returned') NOT NULL,
    quantity_change INT NOT NULL,
    quantity_before INT NOT NULL,
    quantity_after INT NOT NULL,
    reference_type VARCHAR(50),
    reference_id INT,
    reason TEXT,
    performed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_product (product_id),
    INDEX idx_action (action_type),
    INDEX idx_date (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ADMIN_REPORTS TABLE
-- Saved/scheduled reports
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_name VARCHAR(100) NOT NULL,
    report_type ENUM('sales', 'inventory', 'customers', 'rentals', 'returns', 'financial', 'custom') NOT NULL,
    parameters JSON,
    schedule ENUM('none', 'daily', 'weekly', 'monthly') DEFAULT 'none',
    last_generated TIMESTAMP NULL,
    file_path VARCHAR(255),
    created_by INT NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_type (report_type),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- SAMPLE DATA: ADMIN ROLES
-- =====================================================
INSERT INTO admin_roles (role_name, description) VALUES
('super_admin', 'Full system access - can manage everything including other admins'),
('manager', 'Can manage orders, inventory, customers, and view reports'),
('staff', 'Can process orders, dispatch, and handle returns'),
('support', 'Can view orders and respond to customer inquiries');

-- =====================================================
-- SAMPLE DATA: ADMIN PERMISSIONS
-- =====================================================
INSERT INTO admin_permissions (permission_key, permission_name, module, description) VALUES
-- Dashboard
('dashboard.view', 'View Dashboard', 'dashboard', 'Access to admin dashboard'),
('dashboard.analytics', 'View Analytics', 'dashboard', 'Access to detailed analytics'),

-- Orders
('orders.view', 'View Orders', 'orders', 'View order list and details'),
('orders.create', 'Create Orders', 'orders', 'Create new orders manually'),
('orders.edit', 'Edit Orders', 'orders', 'Modify order details'),
('orders.cancel', 'Cancel Orders', 'orders', 'Cancel orders'),
('orders.refund', 'Process Refunds', 'orders', 'Process order refunds'),

-- Dispatch
('dispatch.view', 'View Dispatch', 'dispatch', 'View dispatch schedule'),
('dispatch.assign', 'Assign Dispatch', 'dispatch', 'Assign staff to deliveries'),
('dispatch.complete', 'Complete Dispatch', 'dispatch', 'Mark dispatch as completed'),

-- Inventory
('inventory.view', 'View Inventory', 'inventory', 'View product inventory'),
('inventory.add', 'Add Products', 'inventory', 'Add new products'),
('inventory.edit', 'Edit Products', 'inventory', 'Modify product details'),
('inventory.delete', 'Delete Products', 'inventory', 'Remove products'),
('inventory.adjust', 'Adjust Stock', 'inventory', 'Adjust inventory quantities'),

-- Customers
('customers.view', 'View Customers', 'customers', 'View customer list'),
('customers.edit', 'Edit Customers', 'customers', 'Modify customer details'),
('customers.suspend', 'Suspend Customers', 'customers', 'Suspend customer accounts'),

-- Returns
('returns.view', 'View Returns', 'returns', 'View return requests'),
('returns.process', 'Process Returns', 'returns', 'Process return requests'),
('returns.inspect', 'Inspect Returns', 'returns', 'Inspect returned equipment'),

-- Repairs
('repairs.view', 'View Repairs', 'repairs', 'View repair tickets'),
('repairs.create', 'Create Repairs', 'repairs', 'Create repair tickets'),
('repairs.assign', 'Assign Repairs', 'repairs', 'Assign repair tasks'),
('repairs.complete', 'Complete Repairs', 'repairs', 'Mark repairs as complete'),

-- Late Fees
('latefees.view', 'View Late Fees', 'latefees', 'View late fee records'),
('latefees.waive', 'Waive Late Fees', 'latefees', 'Waive late fees'),

-- Calendar
('calendar.view', 'View Calendar', 'calendar', 'View admin calendar'),
('calendar.manage', 'Manage Calendar', 'calendar', 'Create/edit calendar events'),

-- Reports
('reports.view', 'View Reports', 'reports', 'Access to reports'),
('reports.export', 'Export Reports', 'reports', 'Export report data'),

-- Settings
('settings.view', 'View Settings', 'settings', 'View system settings'),
('settings.edit', 'Edit Settings', 'settings', 'Modify system settings'),

-- Users/Staff
('users.view', 'View Users', 'users', 'View admin users'),
('users.create', 'Create Users', 'users', 'Create admin users'),
('users.edit', 'Edit Users', 'users', 'Edit admin user details'),
('users.roles', 'Manage Roles', 'users', 'Assign roles to users');

-- =====================================================
-- SAMPLE DATA: ROLE PERMISSIONS
-- Super Admin gets all permissions
-- =====================================================
INSERT INTO admin_role_permissions (role_id, permission_id)
SELECT 1, id FROM admin_permissions;

-- Manager gets most permissions except user management
INSERT INTO admin_role_permissions (role_id, permission_id)
SELECT 2, id FROM admin_permissions 
WHERE permission_key NOT IN ('users.create', 'users.edit', 'users.roles', 'settings.edit');

-- Staff gets operational permissions
INSERT INTO admin_role_permissions (role_id, permission_id)
SELECT 3, id FROM admin_permissions 
WHERE module IN ('dashboard', 'orders', 'dispatch', 'returns', 'repairs', 'calendar')
AND permission_key NOT IN ('orders.refund', 'orders.cancel');

-- Support gets view-only permissions
INSERT INTO admin_role_permissions (role_id, permission_id)
SELECT 4, id FROM admin_permissions 
WHERE permission_key LIKE '%view%';

-- =====================================================
-- SAMPLE DATA: ASSIGN ROLES TO EXISTING ADMINS
-- =====================================================
INSERT INTO admin_user_roles (user_id, role_id, assigned_by) VALUES
(1, 1, 1),  -- System Admin = super_admin
(2, 3, 1);  -- Staff Member = staff

-- =====================================================
-- SAMPLE DATA: ADMIN SETTINGS
-- =====================================================
INSERT INTO admin_settings (setting_key, setting_value, setting_type, category, description, is_public) VALUES
-- Business Settings
('business_name', 'RentIt Equipment Rentals', 'string', 'business', 'Business name displayed on site', 1),
('business_email', 'info@rentit.com', 'string', 'business', 'Main business email', 1),
('business_phone', '09123456789', 'string', 'business', 'Main business phone', 1),
('business_address', '123 Main Street, Makati City, Metro Manila', 'string', 'business', 'Business address', 1),

-- Rental Settings
('min_rental_days', '1', 'number', 'rental', 'Minimum rental duration in days', 0),
('max_rental_days', '30', 'number', 'rental', 'Maximum rental duration in days', 0),
('advance_booking_days', '30', 'number', 'rental', 'How many days in advance can book', 0),
('late_fee_percentage', '10', 'number', 'rental', 'Late fee as percentage of daily rate', 0),
('deposit_required', 'true', 'boolean', 'rental', 'Whether deposit is required', 0),

-- Delivery Settings
('delivery_fee_base', '100', 'number', 'delivery', 'Base delivery fee', 0),
('free_delivery_threshold', '2000', 'number', 'delivery', 'Order amount for free delivery', 0),
('delivery_time_slots', '["morning", "afternoon", "evening"]', 'json', 'delivery', 'Available delivery time slots', 0),
('service_area', '["Makati", "Taguig", "Pasig", "Mandaluyong", "Quezon City"]', 'json', 'delivery', 'Service coverage areas', 1),

-- Notification Settings
('email_notifications', 'true', 'boolean', 'notifications', 'Enable email notifications', 0),
('sms_notifications', 'false', 'boolean', 'notifications', 'Enable SMS notifications', 0),
('low_stock_threshold', '2', 'number', 'notifications', 'Alert when stock falls below', 0),

-- Payment Settings
('accepted_payments', '["Cash", "GCash", "Maya", "Credit Card", "Bank Transfer"]', 'json', 'payment', 'Accepted payment methods', 1),
('gcash_number', '09123456789', 'string', 'payment', 'GCash payment number', 1);

-- =====================================================
-- SAMPLE DATA: ADMIN DISPATCH
-- =====================================================
INSERT INTO admin_dispatch (order_id, dispatch_number, dispatch_type, assigned_staff_id, scheduled_date, scheduled_time_slot, status, driver_name, driver_phone, created_by) VALUES
(1, 'DSP-2026-0001', 'delivery', 2, '2026-01-28', 'morning', 'completed', 'Pedro Cruz', '09171234567', 1),
(3, 'DSP-2026-0002', 'delivery', 2, '2026-02-01', 'afternoon', 'completed', 'Pedro Cruz', '09171234567', 1),
(4, 'DSP-2026-0003', 'delivery', 2, '2026-02-05', 'morning', 'pending', 'Pedro Cruz', '09171234567', 1),
(1, 'DSP-2026-0004', 'return_pickup', 2, '2026-02-01', 'afternoon', 'pending', 'Pedro Cruz', '09171234567', 1);

-- =====================================================
-- SAMPLE DATA: ADMIN REPAIRS
-- =====================================================
INSERT INTO admin_repairs (repair_number, product_id, repair_type, priority, reported_by, assigned_to, damage_description, status, estimated_completion) VALUES
('REP-2026-0001', 3, 'maintenance', 'low', 1, 2, 'Routine cleaning and inspection', 'completed', '2026-01-20'),
('REP-2026-0002', 5, 'damage', 'high', 1, 2, 'Speaker cone torn during last rental', 'in_progress', '2026-02-10'),
('REP-2026-0003', 7, 'maintenance', 'medium', 2, NULL, 'Battery replacement needed', 'reported', '2026-02-15');

-- =====================================================
-- SAMPLE DATA: ADMIN STAFF SCHEDULE
-- =====================================================
INSERT INTO admin_staff_schedule (staff_id, schedule_date, shift_start, shift_end, shift_type, max_dispatches, created_by) VALUES
(2, '2026-02-03', '08:00:00', '17:00:00', 'full_day', 5, 1),
(2, '2026-02-04', '08:00:00', '17:00:00', 'full_day', 5, 1),
(2, '2026-02-05', '08:00:00', '17:00:00', 'full_day', 5, 1),
(2, '2026-02-06', '08:00:00', '12:00:00', 'morning', 3, 1),
(2, '2026-02-07', '08:00:00', '17:00:00', 'full_day', 5, 1);

-- =====================================================
-- SAMPLE DATA: ADMIN CALENDAR EVENTS
-- =====================================================
INSERT INTO admin_calendar_events (title, description, event_type, start_datetime, end_datetime, color, created_by, status) VALUES
('Team Meeting', 'Weekly team sync', 'meeting', '2026-02-03 09:00:00', '2026-02-03 10:00:00', '#3b82f6', 1, 'scheduled'),
('Inventory Check', 'Monthly inventory audit', 'maintenance', '2026-02-05 14:00:00', '2026-02-05 17:00:00', '#f59e0b', 1, 'scheduled'),
('Equipment Maintenance', 'Scheduled maintenance for karaoke units', 'maintenance', '2026-02-10 08:00:00', '2026-02-10 12:00:00', '#ef4444', 1, 'scheduled');

-- =====================================================
-- SAMPLE DATA: ADMIN NOTIFICATIONS
-- =====================================================
INSERT INTO admin_notifications (recipient_id, type, priority, title, message, link, is_read) VALUES
(1, 'order', 'normal', 'New Order Received', 'Order #ORD-2026-0005 needs confirmation', 'admin/orders/orders.php', 0),
(1, 'inventory', 'high', 'Low Stock Alert', 'Party Beast 500 is running low (1 unit left)', 'admin/newitem/newitem.php', 0),
(1, 'repair', 'high', 'Repair Needed', 'Thunder Bass 15 reported damaged and needs repair', 'admin/repairs/repairs.php', 0),
(2, 'dispatch', 'normal', 'New Dispatch Assigned', 'You have been assigned to dispatch DSP-2026-0003', 'admin/dispatch/dispatch.php', 0),
(1, 'extension', 'normal', 'Extension Request', 'Customer requested 3-day extension for order #ORD-2026-0001', 'admin/orders/orders.php', 0);

-- =====================================================
-- SAMPLE DATA: ADMIN INVENTORY LOG
-- =====================================================
INSERT INTO admin_inventory_log (product_id, action_type, quantity_change, quantity_before, quantity_after, reference_type, reference_id, reason, performed_by) VALUES
(1, 'rented', -1, 4, 3, 'order', 1, 'Rented to customer', 1),
(2, 'rented', -1, 3, 2, 'order', 3, 'Rented to customer', 1),
(3, 'returned', 1, 5, 6, 'order', 6, 'Returned from rental', 1),
(5, 'damage', -1, 5, 4, 'repair', 2, 'Unit sent for repair', 1),
(1, 'stock_in', 2, 3, 5, NULL, NULL, 'New units purchased', 1);

-- =====================================================
-- VIEWS FOR ADMIN
-- =====================================================

-- View: Dispatch Schedule with Details
CREATE OR REPLACE VIEW v_admin_dispatch_schedule AS
SELECT 
    d.id,
    d.dispatch_number,
    d.dispatch_type,
    d.scheduled_date,
    d.scheduled_time_slot,
    d.status,
    d.driver_name,
    o.order_number,
    u.full_name AS customer_name,
    u.phone AS customer_phone,
    a.full_address AS delivery_address,
    s.full_name AS assigned_staff_name
FROM admin_dispatch d
JOIN orders o ON d.order_id = o.id
JOIN users u ON o.user_id = u.id
LEFT JOIN addresses a ON o.delivery_address_id = a.id
LEFT JOIN users s ON d.assigned_staff_id = s.id
ORDER BY d.scheduled_date ASC, 
    FIELD(d.scheduled_time_slot, 'morning', 'afternoon', 'evening');

-- View: Repairs Overview
CREATE OR REPLACE VIEW v_admin_repairs_overview AS
SELECT 
    r.id,
    r.repair_number,
    r.repair_type,
    r.priority,
    r.status,
    r.estimated_completion,
    p.name AS product_name,
    p.sku AS product_sku,
    reporter.full_name AS reported_by_name,
    assignee.full_name AS assigned_to_name,
    r.total_cost
FROM admin_repairs r
JOIN products p ON r.product_id = p.id
LEFT JOIN users reporter ON r.reported_by = reporter.id
LEFT JOIN users assignee ON r.assigned_to = assignee.id
ORDER BY 
    FIELD(r.priority, 'urgent', 'high', 'medium', 'low'),
    r.created_at DESC;

-- View: Today's Schedule
CREATE OR REPLACE VIEW v_admin_today_schedule AS
SELECT 
    'dispatch' AS event_type,
    d.dispatch_number AS reference,
    CONCAT('Dispatch: ', d.dispatch_type) AS title,
    d.scheduled_time_slot AS time_slot,
    o.order_number,
    u.full_name AS customer_name,
    d.status
FROM admin_dispatch d
JOIN orders o ON d.order_id = o.id
JOIN users u ON o.user_id = u.id
WHERE d.scheduled_date = CURDATE()
UNION ALL
SELECT 
    'event' AS event_type,
    CAST(e.id AS CHAR) AS reference,
    e.title,
    TIME_FORMAT(e.start_datetime, '%H:%i') AS time_slot,
    NULL AS order_number,
    creator.full_name AS customer_name,
    e.status
FROM admin_calendar_events e
JOIN users creator ON e.created_by = creator.id
WHERE DATE(e.start_datetime) = CURDATE()
ORDER BY time_slot;
