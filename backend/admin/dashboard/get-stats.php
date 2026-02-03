<?php
/**
 * =====================================================
 * ADMIN DASHBOARD STATISTICS API
 * Returns dashboard KPIs, recent bookings, and schedule
 * =====================================================
 */

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Include dependencies
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';

// Initialize database
$database = new Database();
$conn = $database->getConnection();

if (!$conn) {
    sendDatabaseError();
}

try {
    $response = [];
    $today = date('Y-m-d');
    $currentMonth = date('Y-m');
    $lastMonth = date('Y-m', strtotime('-1 month'));

    // =====================================================
    // KPI 1: TOTAL REVENUE (This Month)
    // =====================================================
    $revenueQuery = "SELECT 
        COALESCE(SUM(CASE WHEN DATE_FORMAT(created_at, '%Y-%m') = ? THEN total_amount ELSE 0 END), 0) as current_month,
        COALESCE(SUM(CASE WHEN DATE_FORMAT(created_at, '%Y-%m') = ? THEN total_amount ELSE 0 END), 0) as last_month
        FROM orders 
        WHERE status NOT IN ('cancelled') 
        AND payment_status IN ('paid', 'partial')";
    
    $stmt = $conn->prepare($revenueQuery);
    $stmt->bind_param("ss", $currentMonth, $lastMonth);
    $stmt->execute();
    $revenueResult = $stmt->get_result()->fetch_assoc();
    
    $currentRevenue = floatval($revenueResult['current_month']);
    $lastRevenue = floatval($revenueResult['last_month']);
    $revenueChange = $lastRevenue > 0 ? (($currentRevenue - $lastRevenue) / $lastRevenue) * 100 : 0;
    
    $response['kpi'] = [
        'revenue' => [
            'value' => $currentRevenue,
            'change' => round($revenueChange, 1),
            'formatted' => '₱' . number_format($currentRevenue, 0)
        ]
    ];

    // =====================================================
    // KPI 2: ACTIVE RENTALS
    // =====================================================
    $activeQuery = "SELECT COUNT(*) as count FROM orders 
        WHERE status IN ('rented', 'dispatched', 'delivered')";
    $activeResult = $conn->query($activeQuery);
    $activeCount = $activeResult->fetch_assoc()['count'];
    
    // Last week active rentals for comparison
    $lastWeekQuery = "SELECT COUNT(*) as count FROM orders 
        WHERE status IN ('rented', 'dispatched', 'delivered', 'returned', 'completed')
        AND created_at BETWEEN DATE_SUB(CURDATE(), INTERVAL 14 DAY) AND DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
    $lastWeekResult = $conn->query($lastWeekQuery);
    $lastWeekCount = $lastWeekResult->fetch_assoc()['count'];
    $activeChange = $lastWeekCount > 0 ? (($activeCount - $lastWeekCount) / $lastWeekCount) * 100 : 0;
    
    $response['kpi']['active_rentals'] = [
        'value' => intval($activeCount),
        'change' => round($activeChange, 1)
    ];

    // =====================================================
    // KPI 3: PENDING DELIVERIES
    // =====================================================
    $pendingQuery = "SELECT COUNT(*) as count FROM orders 
        WHERE status IN ('confirmed', 'processing')
        AND rental_start >= CURDATE()";
    $pendingResult = $conn->query($pendingQuery);
    $pendingCount = $pendingResult->fetch_assoc()['count'];
    
    // Count days with scheduled deliveries
    $scheduledDaysQuery = "SELECT COUNT(DISTINCT rental_start) as days FROM orders 
        WHERE status IN ('confirmed', 'processing')
        AND rental_start >= CURDATE()
        AND rental_start <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)";
    $scheduledDaysResult = $conn->query($scheduledDaysQuery);
    $scheduledDays = $scheduledDaysResult->fetch_assoc()['days'];
    
    $response['kpi']['pending_deliveries'] = [
        'value' => intval($pendingCount),
        'scheduled_days' => intval($scheduledDays)
    ];

    // =====================================================
    // KPI 4: MACHINES AVAILABLE
    // =====================================================
    $availableQuery = "SELECT 
        SUM(available_quantity) as available,
        SUM(quantity) as total
        FROM products 
        WHERE status != 'retired'";
    $availableResult = $conn->query($availableQuery);
    $inventory = $availableResult->fetch_assoc();
    
    $response['kpi']['machines_available'] = [
        'value' => intval($inventory['available']),
        'total' => intval($inventory['total'])
    ];

    // =====================================================
    // RECENT BOOKINGS (Last 10)
    // =====================================================
    $bookingsQuery = "SELECT 
        o.id,
        o.order_number,
        u.full_name as customer_name,
        u.email as customer_email,
        p.name as product_name,
        p.sku as product_sku,
        o.rental_start,
        o.rental_end,
        DATEDIFF(o.rental_end, o.rental_start) + 1 as rental_days,
        o.status,
        o.total_amount,
        o.created_at
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        ORDER BY o.created_at DESC
        LIMIT 10";
    
    $bookingsResult = $conn->query($bookingsQuery);
    $bookings = [];
    
    while ($row = $bookingsResult->fetch_assoc()) {
        $bookings[] = [
            'id' => $row['id'],
            'order_number' => $row['order_number'],
            'customer_name' => $row['customer_name'],
            'customer_initial' => strtoupper(substr($row['customer_name'], 0, 1)),
            'product_name' => $row['product_name'],
            'product_sku' => $row['product_sku'],
            'rental_start' => $row['rental_start'],
            'rental_end' => $row['rental_end'],
            'rental_days' => intval($row['rental_days']),
            'status' => $row['status'],
            'total_amount' => floatval($row['total_amount']),
            'created_at' => $row['created_at']
        ];
    }
    
    $response['recent_bookings'] = $bookings;

    // =====================================================
    // TODAY'S SCHEDULE (Deliveries & Pickups)
    // =====================================================
    $scheduleItems = [];
    
    // Today's deliveries (orders starting today)
    $deliveriesQuery = "SELECT 
        o.id,
        o.order_number,
        u.full_name as customer_name,
        p.name as product_name,
        p.sku as product_sku,
        a.city,
        o.pickup_time_slot,
        o.status,
        'delivery' as schedule_type
        FROM orders o
        JOIN users u ON o.user_id = u.id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        LEFT JOIN addresses a ON o.delivery_address_id = a.id
        WHERE o.rental_start = ?
        AND o.status IN ('confirmed', 'processing', 'dispatched')
        ORDER BY o.pickup_time_slot";
    
    $stmt = $conn->prepare($deliveriesQuery);
    $stmt->bind_param("s", $today);
    $stmt->execute();
    $deliveriesResult = $stmt->get_result();
    
    while ($row = $deliveriesResult->fetch_assoc()) {
        $scheduleItems[] = [
            'id' => $row['id'],
            'order_number' => $row['order_number'],
            'type' => 'Drop-off',
            'customer_name' => $row['customer_name'],
            'product_name' => $row['product_name'],
            'product_sku' => $row['product_sku'],
            'location' => $row['city'] ?: 'Address pending',
            'time_slot' => $row['pickup_time_slot'] ?: 'TBD',
            'status' => $row['status']
        ];
    }
    
    // Today's pickups (returns scheduled for today)
    $pickupsQuery = "SELECT 
        r.id,
        r.return_number,
        o.order_number,
        u.full_name as customer_name,
        p.name as product_name,
        p.sku as product_sku,
        a.city,
        r.pickup_time_slot,
        r.status
        FROM returns r
        JOIN orders o ON r.order_id = o.id
        JOIN users u ON o.user_id = u.id
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        LEFT JOIN addresses a ON r.pickup_address_id = a.id
        WHERE r.pickup_date = ?
        AND r.status IN ('scheduled', 'in_transit')
        ORDER BY r.pickup_time_slot";
    
    $stmt = $conn->prepare($pickupsQuery);
    $stmt->bind_param("s", $today);
    $stmt->execute();
    $pickupsResult = $stmt->get_result();
    
    while ($row = $pickupsResult->fetch_assoc()) {
        $scheduleItems[] = [
            'id' => $row['id'],
            'return_number' => $row['return_number'],
            'type' => 'Pick-up',
            'customer_name' => $row['customer_name'],
            'product_name' => $row['product_name'],
            'product_sku' => $row['product_sku'],
            'location' => $row['city'] ?: 'Address pending',
            'time_slot' => $row['pickup_time_slot'],
            'status' => $row['status']
        ];
    }
    
    // Sort schedule by time slot
    usort($scheduleItems, function($a, $b) {
        $timeOrder = ['morning' => 1, 'afternoon' => 2, 'evening' => 3, 'TBD' => 4];
        $aTime = $timeOrder[$a['time_slot']] ?? 5;
        $bTime = $timeOrder[$b['time_slot']] ?? 5;
        return $aTime - $bTime;
    });
    
    $response['todays_schedule'] = $scheduleItems;
    $response['schedule_date'] = $today;
    $response['schedule_date_formatted'] = date('M j');

    // =====================================================
    // INVENTORY HEALTH
    // =====================================================
    $inventoryQuery = "SELECT 
        SUM(quantity) as total_units,
        SUM(available_quantity) as available_units,
        SUM(quantity - available_quantity) as rented_units,
        SUM(CASE WHEN status = 'maintenance' THEN quantity ELSE 0 END) as repair_units
        FROM products 
        WHERE status != 'retired'";
    
    $inventoryResult = $conn->query($inventoryQuery);
    $inventoryData = $inventoryResult->fetch_assoc();
    
    $totalUnits = intval($inventoryData['total_units']);
    $availableUnits = intval($inventoryData['available_units']);
    $rentedUnits = intval($inventoryData['rented_units']);
    $repairUnits = intval($inventoryData['repair_units']);
    
    $response['inventory'] = [
        'total' => $totalUnits,
        'available' => $availableUnits,
        'rented' => $rentedUnits,
        'repair' => $repairUnits,
        'cleaning' => 0, // Could be tracked separately
        'rented_percentage' => $totalUnits > 0 ? round(($rentedUnits / $totalUnits) * 100) : 0,
        'repair_percentage' => $totalUnits > 0 ? round(($repairUnits / $totalUnits) * 100) : 0,
        'available_percentage' => $totalUnits > 0 ? round(($availableUnits / $totalUnits) * 100) : 0
    ];

    // Send success response
    $response['success'] = true;
    $response['generated_at'] = date('Y-m-d H:i:s');
    
    echo json_encode($response);

} catch (Exception $e) {
    sendError('Failed to fetch dashboard data: ' . $e->getMessage(), 500);
}

$database->closeConnection();
?>
