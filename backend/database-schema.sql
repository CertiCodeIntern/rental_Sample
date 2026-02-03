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
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) DEFAULT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'admin') DEFAULT 'customer',
    profile_image VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- INSERT DEFAULT ADMIN USER
-- Email: admin@rentit.com
-- Password: password (plain text)
-- Hash generated with: password_hash('password', PASSWORD_DEFAULT)
-- =====================================================
INSERT INTO users (full_name, email, phone, password, role) VALUES
('System Admin', 'admin@rentit.com', '09123456789', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- =====================================================
-- SAMPLE CUSTOMERS
-- Password for all: password (plain text)
-- =====================================================
INSERT INTO users (full_name, email, phone, password, role) VALUES
('John Doe', 'john@example.com', '09111111111', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer'),
('Jane Smith', 'jane@example.com', '09222222222', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer');

-- =====================================================
-- PRODUCTS/EQUIPMENT TABLE (Future)
-- =====================================================
-- CREATE TABLE IF NOT EXISTS products (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     name VARCHAR(200) NOT NULL,
--     description TEXT,
--     category VARCHAR(50),
--     daily_rate DECIMAL(10,2) NOT NULL,
--     weekly_rate DECIMAL(10,2),
--     monthly_rate DECIMAL(10,2),
--     quantity INT DEFAULT 1,
--     available_quantity INT DEFAULT 1,
--     image_url VARCHAR(255),
--     status ENUM('available', 'rented', 'maintenance') DEFAULT 'available',
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ORDERS/RENTALS TABLE (Future)
-- =====================================================
-- CREATE TABLE IF NOT EXISTS orders (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
--     order_number VARCHAR(50) UNIQUE,
--     total_amount DECIMAL(10,2) NOT NULL,
--     status ENUM('pending', 'confirmed', 'dispatched', 'returned', 'cancelled') DEFAULT 'pending',
--     rental_start DATE NOT NULL,
--     rental_end DATE NOT NULL,
--     notes TEXT,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--     
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- ORDER ITEMS TABLE (Future)
-- =====================================================
-- CREATE TABLE IF NOT EXISTS order_items (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     order_id INT NOT NULL,
--     product_id INT NOT NULL,
--     quantity INT DEFAULT 1,
--     daily_rate DECIMAL(10,2) NOT NULL,
--     subtotal DECIMAL(10,2) NOT NULL,
--     
--     FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
--     FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
