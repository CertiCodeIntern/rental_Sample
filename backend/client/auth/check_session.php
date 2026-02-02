<?php
/**
 * =====================================================
 * CLIENT SESSION CHECK ENDPOINT
 * GET /backend/client/auth/check_session.php
 * =====================================================
 */

// Include dependencies
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../helpers/response.php';

// Set CORS headers
setCorsHeaders("GET");

// Start session
session_start();

// Check if user is logged in
if (isset($_SESSION['user_id'])) {
    sendSuccess("Session active", [
        "authenticated" => true,
        "user" => [
            "id" => $_SESSION['user_id'],
            "email" => $_SESSION['user_email'],
            "role" => $_SESSION['user_role'],
            "name" => $_SESSION['user_name']
        ]
    ]);
} else {
    sendSuccess("No active session", [
        "authenticated" => false
    ]);
}
?>
