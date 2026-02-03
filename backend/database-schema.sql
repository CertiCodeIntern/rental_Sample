-- =====================================================
-- RENTAL SYSTEM DATABASE SCHEMA
-- MySQL Database for RentIt Application
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS rental_system;
USE rental_system;

-- =====================================================
-- USERS TABLE
-- Stores both customers (client) and admins
-- =====================================================
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS addresses;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) DEFAULT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    profile_image VARCHAR(255) DEFAULT NULL,
    email_verified TINYINT(1) DEFAULT 0,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ADDRESSES TABLE
-- User delivery/pickup addresses
-- =====================================================
CREATE TABLE IF NOT EXISTS addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    label VARCHAR(50) DEFAULT 'Home',
    full_address TEXT NOT NULL,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(10),
    landmark VARCHAR(255),
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20),
    is_default TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- CATEGORIES TABLE
-- Product categories
-- =====================================================
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    parent_id INT DEFAULT NULL,
    sort_order INT DEFAULT 0,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- PRODUCTS/EQUIPMENT TABLE
-- Rental items
-- =====================================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    category_id INT,
    daily_rate DECIMAL(10,2) NOT NULL,
    weekly_rate DECIMAL(10,2),
    monthly_rate DECIMAL(10,2),
    deposit_amount DECIMAL(10,2) DEFAULT 0,
    quantity INT DEFAULT 1,
    available_quantity INT DEFAULT 1,
    image_url VARCHAR(255),
    gallery JSON,
    specifications JSON,
    status ENUM('available', 'rented', 'maintenance', 'retired') DEFAULT 'available',
    featured TINYINT(1) DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0,
    rating_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_status (status),
    INDEX idx_featured (featured),
    FULLTEXT idx_search (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ORDERS/RENTALS TABLE
-- Main rental transactions
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    service_fee DECIMAL(10,2) DEFAULT 0,
    delivery_fee DECIMAL(10,2) DEFAULT 0,
    discount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    deposit_amount DECIMAL(10,2) DEFAULT 0,
    status ENUM('pending', 'confirmed', 'processing', 'dispatched', 'delivered', 'rented', 'returning', 'returned', 'completed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'partial', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    rental_start DATE NOT NULL,
    rental_end DATE NOT NULL,
    actual_return_date DATE NULL,
    delivery_address_id INT,
    delivery_notes TEXT,
    pickup_time_slot VARCHAR(50),
    notes TEXT,
    cancelled_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (delivery_address_id) REFERENCES addresses(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_dates (rental_start, rental_end),
    INDEX idx_order_number (order_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ORDER ITEMS TABLE
-- Individual items in each order
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    daily_rate DECIMAL(10,2) NOT NULL,
    rental_days INT NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'rented', 'extended', 'returned', 'damaged') DEFAULT 'pending',
    condition_before TEXT,
    condition_after TEXT,
    damage_fee DECIMAL(10,2) DEFAULT 0,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- RESERVATIONS TABLE
-- Future bookings that block availability
-- =====================================================
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    order_id INT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_product_dates (product_id, start_date, end_date),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- EXTENSIONS TABLE
-- Rental extension requests
-- =====================================================
CREATE TABLE IF NOT EXISTS extensions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_item_id INT NOT NULL,
    original_end_date DATE NOT NULL,
    new_end_date DATE NOT NULL,
    extension_days INT NOT NULL,
    extension_fee DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'paid') DEFAULT 'pending',
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP NULL,
    
    FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- RETURNS TABLE
-- Return requests and pickup scheduling
-- =====================================================
CREATE TABLE IF NOT EXISTS returns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    return_number VARCHAR(50) UNIQUE NOT NULL,
    pickup_date DATE NOT NULL,
    pickup_time_slot ENUM('morning', 'afternoon', 'evening') NOT NULL,
    pickup_address_id INT,
    equipment_condition ENUM('excellent', 'good', 'damaged') DEFAULT 'excellent',
    damage_notes TEXT,
    additional_notes TEXT,
    status ENUM('scheduled', 'in_transit', 'picked_up', 'inspected', 'completed', 'cancelled') DEFAULT 'scheduled',
    damage_fee DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (pickup_address_id) REFERENCES addresses(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_pickup_date (pickup_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- CART ITEMS TABLE
-- Shopping cart items
-- =====================================================
CREATE TABLE IF NOT EXISTS cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    rental_start DATE,
    rental_end DATE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_item (user_id, product_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- FAVORITES TABLE
-- User's favorite/wishlist items
-- =====================================================
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, product_id),
    INDEX idx_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- REVIEWS TABLE
-- Product reviews and ratings
-- =====================================================
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    order_id INT,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    comment TEXT,
    is_verified TINYINT(1) DEFAULT 0,
    is_approved TINYINT(1) DEFAULT 1,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    UNIQUE KEY unique_review (user_id, product_id),
    INDEX idx_product (product_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- NOTIFICATIONS TABLE
-- User notifications
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type ENUM('order', 'payment', 'return', 'extension', 'promotion', 'system') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255),
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- LATE FEES TABLE
-- Track late return fees
-- =====================================================
CREATE TABLE IF NOT EXISTS late_fees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    days_late INT NOT NULL,
    daily_late_fee DECIMAL(10,2) NOT NULL,
    total_fee DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'waived') DEFAULT 'pending',
    waived_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ACTIVITY LOG TABLE
-- Audit trail for important actions
-- =====================================================
CREATE TABLE IF NOT EXISTS activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    old_values JSON,
    new_values JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_action (action),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- SAMPLE DATA: USERS
-- Password for all: password
-- =====================================================
INSERT INTO users (full_name, email, phone, password, role, status) VALUES
('System Admin', 'admin@rentit.com', '09123456789', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active'),
('Staff Member', 'staff@rentit.com', '09123456780', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active'),
('John Doe', 'john@example.com', '09111111111', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'active'),
('Jane Smith', 'jane@example.com', '09222222222', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'active'),
('Bob Wilson', 'bob@example.com', '09333333333', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'active'),
('Maria Santos', 'maria@example.com', '09444444444', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'active'),
('Carlos Reyes', 'carlos@example.com', '09555555555', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'active'),
('Ana Garcia', 'ana@example.com', '09666666666', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer', 'inactive');

-- =====================================================
-- SAMPLE DATA: ADDRESSES
-- =====================================================
INSERT INTO addresses (user_id, label, full_address, city, province, landmark, contact_person, contact_phone, is_default) VALUES
(3, 'Home', '123 Main Street, Barangay Sample', 'Makati City', 'Metro Manila', 'Near SM Makati', 'John Doe', '09111111111', 1),
(3, 'Office', '456 Business Ave, Barangay Poblacion', 'Taguig City', 'Metro Manila', 'BGC Area', 'John Doe', '09111111111', 0),
(4, 'Home', '789 Residential St, Barangay San Antonio', 'Pasig City', 'Metro Manila', 'Near Megamall', 'Jane Smith', '09222222222', 1),
(5, 'Home', '321 Suburb Road, Barangay Central', 'Quezon City', 'Metro Manila', 'Near Trinoma', 'Bob Wilson', '09333333333', 1),
(6, 'Home', '654 Coastal Drive, Barangay Seaside', 'Parañaque City', 'Metro Manila', 'Near SM Bicutan', 'Maria Santos', '09444444444', 1);

-- =====================================================
-- SAMPLE DATA: CATEGORIES
-- =====================================================
INSERT INTO categories (name, slug, description, icon, sort_order) VALUES
('Karaoke Systems', 'karaoke-systems', 'Complete karaoke machines with microphones', '🎤', 1),
('Speakers', 'speakers', 'Professional audio speakers and sound systems', '🔊', 2),
('Microphones', 'microphones', 'Wireless and wired microphones', '🎙️', 3),
('Lighting', 'lighting', 'Party lights, disco balls, and LED effects', '💡', 4),
('Accessories', 'accessories', 'Cables, stands, and other equipment', '🔌', 5),
('Party Packages', 'party-packages', 'Complete party equipment bundles', '🎉', 6);

-- =====================================================
-- SAMPLE DATA: PRODUCTS
-- =====================================================
INSERT INTO products (sku, name, slug, description, category_id, daily_rate, weekly_rate, deposit_amount, quantity, available_quantity, image_url, status, featured, rating_avg, rating_count) VALUES
('VDK-001', 'Karaoke King Pro V2', 'karaoke-king-pro-v2', 'Professional karaoke system with 22-inch touchscreen, 2TB song database with 50,000+ songs, dual wireless microphones, and built-in 300W speaker system.', 1, 500.00, 3000.00, 2000.00, 5, 3, 'assets/images/products/karaoke-king-v2.jpg', 'available', 1, 4.80, 25),
('VDK-002', 'Platinum Sound System X100', 'platinum-sound-system-x100', 'High-end karaoke system with premium audio quality, 4K display output, 3TB storage, and premium wireless microphone set.', 1, 800.00, 5000.00, 3000.00, 3, 2, 'assets/images/products/platinum-x100.jpg', 'available', 1, 4.90, 18),
('VDK-003', 'Mini Star Portable', 'mini-star-portable', 'Compact and portable karaoke system perfect for small gatherings. Includes Bluetooth connectivity and 2 microphones.', 1, 300.00, 1800.00, 1000.00, 8, 6, 'assets/images/products/ministar.jpg', 'available', 0, 4.50, 42),
('VDK-004', 'Party Beast 500', 'party-beast-500', 'Ultimate party karaoke system with massive 500W output, LED light show, and fog machine compatibility.', 1, 1200.00, 7500.00, 5000.00, 2, 1, 'assets/images/products/party-beast.jpg', 'available', 1, 4.95, 12),
('SPK-001', 'Thunder Bass 15', 'thunder-bass-15', '15-inch professional speaker with 1000W peak power, perfect for outdoor events.', 2, 400.00, 2400.00, 1500.00, 6, 4, 'assets/images/products/thunder-bass.jpg', 'available', 0, 4.60, 35),
('SPK-002', 'Crystal Clear Tower', 'crystal-clear-tower', 'Premium tower speaker set with crystal-clear audio and deep bass response.', 2, 350.00, 2100.00, 1200.00, 4, 3, 'assets/images/products/crystal-tower.jpg', 'available', 0, 4.40, 28),
('MIC-001', 'Wireless Pro Duo', 'wireless-pro-duo', 'Professional wireless microphone set with 2 handheld mics, 100m range, and 8-hour battery life.', 3, 200.00, 1200.00, 800.00, 10, 8, 'assets/images/products/wireless-duo.jpg', 'available', 0, 4.70, 55),
('MIC-002', 'Studio Gold Wireless', 'studio-gold-wireless', 'Premium gold-finished wireless microphone with studio-quality sound.', 3, 150.00, 900.00, 500.00, 15, 12, 'assets/images/products/studio-gold.jpg', 'available', 0, 4.55, 40),
('LGT-001', 'Disco Party Pack', 'disco-party-pack', 'Complete lighting package with disco ball, LED par lights, and strobe effects.', 4, 250.00, 1500.00, 1000.00, 5, 4, 'assets/images/products/disco-pack.jpg', 'available', 0, 4.30, 22),
('LGT-002', 'RGB Moving Head Set', 'rgb-moving-head-set', 'Professional moving head lights with RGB color mixing and DMX control.', 4, 450.00, 2700.00, 2000.00, 3, 2, 'assets/images/products/moving-head.jpg', 'available', 0, 4.75, 15),
('PKG-001', 'Birthday Bash Bundle', 'birthday-bash-bundle', 'Complete birthday party package: Karaoke system + speakers + lights + microphones.', 6, 1500.00, 9000.00, 5000.00, 3, 2, 'assets/images/products/birthday-bundle.jpg', 'available', 1, 4.85, 30),
('PKG-002', 'Corporate Event Package', 'corporate-event-package', 'Professional setup for corporate events: Premium karaoke + PA system + wireless mics.', 6, 2000.00, 12000.00, 8000.00, 2, 1, 'assets/images/products/corporate-pkg.jpg', 'available', 1, 4.90, 8);

-- =====================================================
-- SAMPLE DATA: ORDERS
-- =====================================================
INSERT INTO orders (user_id, order_number, subtotal, service_fee, delivery_fee, total_amount, deposit_amount, status, payment_status, payment_method, rental_start, rental_end, delivery_address_id) VALUES
(3, 'ORD-2026-0001', 1500.00, 75.00, 100.00, 1675.00, 2000.00, 'rented', 'paid', 'GCash', '2026-01-28', '2026-01-31', 1),
(3, 'ORD-2026-0002', 600.00, 30.00, 100.00, 730.00, 800.00, 'completed', 'paid', 'Cash', '2026-01-15', '2026-01-17', 1),
(4, 'ORD-2026-0003', 2400.00, 120.00, 150.00, 2670.00, 3000.00, 'rented', 'paid', 'Credit Card', '2026-02-01', '2026-02-04', 3),
(5, 'ORD-2026-0004', 800.00, 40.00, 100.00, 940.00, 1500.00, 'confirmed', 'paid', 'GCash', '2026-02-05', '2026-02-07', 4),
(6, 'ORD-2026-0005', 3000.00, 150.00, 0.00, 3150.00, 5000.00, 'pending', 'pending', NULL, '2026-02-10', '2026-02-12', 5),
(3, 'ORD-2026-0006', 900.00, 45.00, 100.00, 1045.00, 1000.00, 'returned', 'paid', 'GCash', '2026-01-10', '2026-01-13', 1),
(4, 'ORD-2026-0007', 1200.00, 60.00, 100.00, 1360.00, 2000.00, 'cancelled', 'refunded', 'Credit Card', '2026-01-20', '2026-01-22', 3);

-- =====================================================
-- SAMPLE DATA: ORDER ITEMS
-- =====================================================
INSERT INTO order_items (order_id, product_id, quantity, daily_rate, rental_days, subtotal, status) VALUES
(1, 1, 1, 500.00, 3, 1500.00, 'rented'),
(2, 7, 1, 200.00, 3, 600.00, 'returned'),
(3, 2, 1, 800.00, 3, 2400.00, 'rented'),
(4, 5, 1, 400.00, 2, 800.00, 'pending'),
(5, 11, 1, 1500.00, 2, 3000.00, 'pending'),
(6, 3, 1, 300.00, 3, 900.00, 'returned'),
(7, 4, 1, 1200.00, 2, 2400.00, 'pending');

-- =====================================================
-- SAMPLE DATA: RESERVATIONS (Future bookings)
-- =====================================================
INSERT INTO reservations (product_id, user_id, order_id, start_date, end_date, status) VALUES
(1, 3, 1, '2026-01-28', '2026-01-31', 'confirmed'),
(1, 4, NULL, '2026-02-08', '2026-02-15', 'confirmed'),
(1, 5, NULL, '2026-02-20', '2026-02-25', 'pending'),
(2, 4, 3, '2026-02-01', '2026-02-04', 'confirmed'),
(2, 6, NULL, '2026-02-10', '2026-02-14', 'confirmed'),
(5, 5, 4, '2026-02-05', '2026-02-07', 'confirmed'),
(11, 6, 5, '2026-02-10', '2026-02-12', 'pending');

-- =====================================================
-- SAMPLE DATA: EXTENSIONS
-- =====================================================
INSERT INTO extensions (order_item_id, original_end_date, new_end_date, extension_days, extension_fee, status) VALUES
(1, '2026-01-31', '2026-02-03', 3, 1575.00, 'pending'),
(6, '2026-01-13', '2026-01-15', 2, 630.00, 'paid');

-- =====================================================
-- SAMPLE DATA: RETURNS
-- =====================================================
INSERT INTO returns (order_id, return_number, pickup_date, pickup_time_slot, pickup_address_id, equipment_condition, status) VALUES
(2, 'RET-2026-0001', '2026-01-17', 'morning', 1, 'excellent', 'completed'),
(6, 'RET-2026-0002', '2026-01-13', 'afternoon', 1, 'good', 'completed');

-- =====================================================
-- SAMPLE DATA: CART ITEMS
-- =====================================================
INSERT INTO cart_items (user_id, product_id, quantity, rental_start, rental_end) VALUES
(3, 9, 1, '2026-02-15', '2026-02-17'),
(3, 8, 2, '2026-02-15', '2026-02-17'),
(5, 10, 1, '2026-02-20', '2026-02-22');

-- =====================================================
-- SAMPLE DATA: FAVORITES
-- =====================================================
INSERT INTO favorites (user_id, product_id) VALUES
(3, 1), (3, 4), (3, 11),
(4, 2), (4, 5), (4, 9),
(5, 1), (5, 3), (5, 7),
(6, 4), (6, 11), (6, 12);

-- =====================================================
-- SAMPLE DATA: REVIEWS
-- =====================================================
INSERT INTO reviews (user_id, product_id, order_id, rating, title, comment, is_verified, helpful_count) VALUES
(3, 1, 1, 5, 'Absolutely Amazing!', 'The Karaoke King Pro V2 exceeded all my expectations! Crystal clear audio, massive song library, and the touchscreen is so intuitive. Our family party was a huge hit!', 1, 15),
(4, 2, 3, 5, 'Premium Quality', 'Worth every peso! The sound quality is unmatched. Perfect for our company event.', 1, 8),
(3, 7, 2, 4, 'Great wireless mics', 'Excellent range and battery life. Only wish they came with a carrying case.', 1, 12),
(5, 3, NULL, 5, 'Perfect for small gatherings', 'Compact but powerful! Easy to set up and the Bluetooth feature is super convenient.', 0, 6),
(6, 1, NULL, 4, 'Great system', 'Loved it for our birthday party. Delivery was on time and everything worked perfectly.', 0, 4);

-- =====================================================
-- SAMPLE DATA: NOTIFICATIONS
-- =====================================================
INSERT INTO notifications (user_id, type, title, message, link, is_read) VALUES
(3, 'order', 'Order Confirmed', 'Your order #ORD-2026-0001 has been confirmed and is being prepared for delivery.', 'client/myrentals/myrentals.php', 1),
(3, 'order', 'Equipment Delivered', 'Your rental equipment has been delivered successfully. Enjoy your party!', 'client/myrentals/myrentals.php', 1),
(3, 'extension', 'Extension Request Received', 'Your extension request for 3 days is being processed.', 'client/returns/returns.php', 0),
(4, 'order', 'Order Confirmed', 'Your order #ORD-2026-0003 has been confirmed.', 'client/myrentals/myrentals.php', 0),
(4, 'payment', 'Payment Received', 'We have received your payment of ₱2,670.00. Thank you!', 'client/bookinghistory/bookinghistory.php', 1),
(5, 'order', 'Order Pending', 'Your order #ORD-2026-0004 is pending confirmation.', 'client/myrentals/myrentals.php', 0),
(6, 'promotion', 'Weekend Special!', 'Get 20% off on all Party Packages this weekend. Use code: PARTY20', 'client/catalog/catalog.php', 0),
(3, 'return', 'Return Scheduled', 'Your return pickup has been scheduled for Jan 31, 2026 (Morning).', 'client/returns/returns.php', 0);

-- =====================================================
-- SAMPLE DATA: LATE FEES
-- =====================================================
INSERT INTO late_fees (order_id, days_late, daily_late_fee, total_fee, status) VALUES
(6, 2, 150.00, 300.00, 'paid');

-- =====================================================
-- SAMPLE DATA: ACTIVITY LOG
-- =====================================================
INSERT INTO activity_log (user_id, action, entity_type, entity_id, new_values) VALUES
(1, 'user_login', 'user', 1, '{"ip": "192.168.1.1"}'),
(3, 'order_created', 'order', 1, '{"order_number": "ORD-2026-0001", "total": 1675.00}'),
(1, 'order_confirmed', 'order', 1, '{"status": "confirmed"}'),
(3, 'extension_requested', 'extension', 1, '{"days": 3, "fee": 1575.00}'),
(4, 'order_created', 'order', 3, '{"order_number": "ORD-2026-0003", "total": 2670.00}'),
(1, 'product_updated', 'product', 1, '{"available_quantity": 3}');

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: Active Rentals with Customer Info
CREATE OR REPLACE VIEW v_active_rentals AS
SELECT 
    o.id AS order_id,
    o.order_number,
    u.full_name AS customer_name,
    u.email AS customer_email,
    u.phone AS customer_phone,
    p.name AS product_name,
    p.sku AS product_sku,
    oi.quantity,
    o.rental_start,
    o.rental_end,
    DATEDIFF(o.rental_end, CURDATE()) AS days_remaining,
    o.total_amount,
    o.status
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.status IN ('rented', 'dispatched', 'delivered')
ORDER BY o.rental_end ASC;

-- View: Product Availability
CREATE OR REPLACE VIEW v_product_availability AS
SELECT 
    p.id,
    p.sku,
    p.name,
    p.quantity AS total_quantity,
    p.available_quantity,
    (p.quantity - p.available_quantity) AS currently_rented,
    p.daily_rate,
    p.status
FROM products p
WHERE p.status != 'retired'
ORDER BY p.name;

-- View: Upcoming Reservations
CREATE OR REPLACE VIEW v_upcoming_reservations AS
SELECT 
    r.id AS reservation_id,
    p.name AS product_name,
    p.sku AS product_sku,
    u.full_name AS customer_name,
    r.start_date,
    r.end_date,
    DATEDIFF(r.start_date, CURDATE()) AS days_until_start,
    r.status
FROM reservations r
JOIN products p ON r.product_id = p.id
JOIN users u ON r.user_id = u.id
WHERE r.start_date >= CURDATE()
AND r.status IN ('pending', 'confirmed')
ORDER BY r.start_date ASC;
