<?php
/**
 * =====================================================
 * ADMIN SESSION CHECK ENDPOINT
 * GET /backend/admin/auth/check_session.php
 * 
 * Verifies user is authenticated AND has admin role
 * =====================================================
 */

// Include dependencies
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../helpers/response.php';

// Set CORS headers
setCorsHeaders("GET");

// Start session
session_start();

// Check if user is logged in AND is admin
if (isset($_SESSION['user_id']) && isset($_SESSION['is_admin']) && $_SESSION['is_admin'] === true) {
    sendSuccess("Admin session active", [
        "authenticated" => true,
        "is_admin" => true,
        "user" => [
            "id" => $_SESSION['user_id'],
            "email" => $_SESSION['user_email'],
            "role" => $_SESSION['user_role'],
            "name" => $_SESSION['user_name']
        ]
    ]);
} elseif (isset($_SESSION['user_id'])) {
    // User is logged in but not admin
    sendForbidden("Access denied. Admin privileges required.");
} else {
    sendSuccess("No active session", [
        "authenticated" => false,
        "is_admin" => false
    ]);
}
?>
