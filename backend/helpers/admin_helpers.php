<?php
/**
 * =====================================================
 * ADMIN HELPER FUNCTIONS
 * Database queries for admin dashboard and pages
 * =====================================================
 */

require_once __DIR__ . '/../config/database.php';

// =====================================================
// DASHBOARD KPI FUNCTIONS
// =====================================================

/**
 * Get dashboard KPI statistics
 * 
 * @return array KPI data (revenue, active rentals, customers, equipment)
 */
function getDashboardKPIs() {
    $db = new Database();
    $conn = $db->getConnection();
    
    if (!$conn) {
        return [
            'total_revenue' => 0,
            'active_rentals' => 0,
            'total_customers' => 0,
            'available_equipment' => 0
        ];
    }
    
    // Total Revenue (this month)
    $revenueQuery = "
        SELECT COALESCE(SUM(total_amount), 0) AS total_revenue
        FROM orders 
        WHERE payment_status = 'paid'
        AND MONTH(created_at) = MONTH(CURDATE())
        AND YEAR(created_at) = YEAR(CURDATE())
    ";
    $revenueResult = $conn->query($revenueQuery);
    $totalRevenue = $revenueResult->fetch_assoc()['total_revenue'] ?? 0;
    
    // Active Rentals
    $activeQuery = "
        SELECT COUNT(*) AS active_rentals
        FROM orders 
        WHERE status IN ('rented', 'delivered', 'dispatched')
    ";
    $activeResult = $conn->query($activeQuery);
    $activeRentals = $activeResult->fetch_assoc()['active_rentals'] ?? 0;
    
    // Total Customers
    $customersQuery = "
        SELECT COUNT(*) AS total_customers
        FROM users 
        WHERE role = 'customer' AND status = 'active'
    ";
    $customersResult = $conn->query($customersQuery);
    $totalCustomers = $customersResult->fetch_assoc()['total_customers'] ?? 0;
    
    // Available Equipment
    $equipmentQuery = "
        SELECT SUM(available_quantity) AS available_equipment
        FROM products 
        WHERE status = 'available'
    ";
    $equipmentResult = $conn->query($equipmentQuery);
    $availableEquipment = $equipmentResult->fetch_assoc()['available_equipment'] ?? 0;
    
    $conn->close();
    
    return [
        'total_revenue' => $totalRevenue,
        'active_rentals' => $activeRentals,
        'total_customers' => $totalCustomers,
        'available_equipment' => $availableEquipment
    ];
}

// =====================================================
// RECENT BOOKINGS FUNCTION
// =====================================================

/**
 * Get recent bookings for dashboard
 * 
 * @param int $limit Number of bookings to return
 * @return array Array of recent booking records
 */
function getRecentBookings($limit = 10) {
    $db = new Database();
    $conn = $db->getConnection();
    
    if (!$conn) {
        return [];
    }
    
    $query = "
        SELECT 
            o.id AS order_id,
            o.order_number,
            o.rental_start,
            o.rental_end,
            DATEDIFF(o.rental_end, o.rental_start) + 1 AS rental_days,
            o.status AS order_status,
            o.total_amount,
            o.created_at,
            u.id AS user_id,
            u.full_name AS customer_name,
            u.email AS customer_email,
            u.phone AS customer_phone,
            p.id AS product_id,
            p.sku AS machine_sku,
            p.name AS machine_name,
            p.image_url AS machine_image
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        ORDER BY o.created_at DESC
        LIMIT ?
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $bookings = [];
    while ($row = $result->fetch_assoc()) {
        $bookings[] = $row;
    }
    
    $stmt->close();
    $conn->close();
    
    return $bookings;
}

// =====================================================
// EQUIPMENT STATUS FUNCTION
// =====================================================

/**
 * Get equipment status for dashboard
 * 
 * @param int $limit Number of items to return
 * @return array Array of equipment with status
 */
function getEquipmentStatus($limit = 10) {
    $db = new Database();
    $conn = $db->getConnection();
    
    if (!$conn) {
        return [];
    }
    
    $query = "
        SELECT 
            p.id,
            p.sku,
            p.name,
            p.quantity AS total_quantity,
            p.available_quantity,
            (p.quantity - p.available_quantity) AS rented_quantity,
            p.status,
            p.image_url,
            c.name AS category_name
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.available_quantity ASC, p.name ASC
        LIMIT ?
    ";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $limit);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $equipment = [];
    while ($row = $result->fetch_assoc()) {
        $equipment[] = $row;
    }
    
    $stmt->close();
    $conn->close();
    
    return $equipment;
}

// =====================================================
// PENDING ACTIONS FUNCTION
// =====================================================

/**
 * Get pending actions count for dashboard alerts
 * 
 * @return array Counts of pending items
 */
function getPendingActions() {
    $db = new Database();
    $conn = $db->getConnection();
    
    if (!$conn) {
        return [
            'pending_orders' => 0,
            'pending_returns' => 0,
            'pending_extensions' => 0,
            'low_stock_items' => 0
        ];
    }
    
    // Pending Orders
    $pendingOrdersQuery = "SELECT COUNT(*) AS count FROM orders WHERE status = 'pending'";
    $pendingOrders = $conn->query($pendingOrdersQuery)->fetch_assoc()['count'] ?? 0;
    
    // Pending Returns
    $pendingReturnsQuery = "SELECT COUNT(*) AS count FROM returns WHERE status IN ('scheduled', 'in_transit')";
    $pendingReturns = $conn->query($pendingReturnsQuery)->fetch_assoc()['count'] ?? 0;
    
    // Pending Extensions
    $pendingExtensionsQuery = "SELECT COUNT(*) AS count FROM extensions WHERE status = 'pending'";
    $pendingExtensions = $conn->query($pendingExtensionsQuery)->fetch_assoc()['count'] ?? 0;
    
    // Low Stock Items (available_quantity <= 2)
    $lowStockQuery = "SELECT COUNT(*) AS count FROM products WHERE available_quantity <= 2 AND status = 'available'";
    $lowStockItems = $conn->query($lowStockQuery)->fetch_assoc()['count'] ?? 0;
    
    $conn->close();
    
    return [
        'pending_orders' => $pendingOrders,
        'pending_returns' => $pendingReturns,
        'pending_extensions' => $pendingExtensions,
        'low_stock_items' => $lowStockItems
    ];
}

// =====================================================
// HELPER FORMATTING FUNCTIONS
// =====================================================

/**
 * Format currency in Philippine Peso
 * 
 * @param float $amount The amount to format
 * @return string Formatted currency string
 */
function formatPeso($amount) {
    return '₱' . number_format($amount, 2);
}

/**
 * Format date for display
 * 
 * @param string $date Date string
 * @param string $format Output format (default: 'M d')
 * @return string Formatted date
 */
function formatDate($date, $format = 'M d') {
    return date($format, strtotime($date));
}

/**
 * Get status badge class based on order status
 * 
 * @param string $status Order status
 * @return string CSS class for badge
 */
function getStatusBadgeClass($status) {
    $classes = [
        'pending' => 'badge-warning',
        'confirmed' => 'badge-info',
        'processing' => 'badge-info',
        'dispatched' => 'badge-info',
        'delivered' => 'badge-success',
        'rented' => 'badge-success',
        'returning' => 'badge-warning',
        'returned' => 'badge-success',
        'completed' => 'badge-success',
        'cancelled' => 'badge-danger',
        'in_transit' => 'badge-info',
        'booked' => 'badge-primary'
    ];
    
    return $classes[strtolower($status)] ?? 'badge-secondary';
}

/**
 * Get customer initials for avatar
 * 
 * @param string $name Full name
 * @return string First letter of name
 */
function getInitials($name) {
    $words = explode(' ', trim($name));
    return strtoupper(substr($words[0], 0, 1));
}

/**
 * Get avatar color based on name
 * 
 * @param string $name Customer name
 * @return string CSS color class
 */
function getAvatarColor($name) {
    $colors = ['avatar-blue', 'avatar-green', 'avatar-orange', 'avatar-purple', 'avatar-red'];
    $index = ord(strtoupper(substr($name, 0, 1))) % count($colors);
    return $colors[$index];
}
