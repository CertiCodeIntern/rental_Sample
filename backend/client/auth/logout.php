<?php
/**
 * =====================================================
 * CLIENT LOGOUT ENDPOINT
 * POST /backend/client/auth/logout.php
 * =====================================================
 */

// Include dependencies
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../helpers/response.php';

// Set CORS headers
setCorsHeaders("POST");

// Start session
session_start();

// Destroy all session data
session_unset();
session_destroy();

// Send success response
sendSuccess("Logged out successfully");
?>
