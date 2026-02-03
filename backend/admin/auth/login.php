<?php
/**
 * =====================================================
 * ADMIN LOGIN ENDPOINT
 * POST /backend/admin/auth/login.php
 * 
 * Only allows users with 'admin' role to login
 * =====================================================
 */

// Include dependencies
require_once __DIR__ . '/../../config/cors.php';
require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../helpers/validation.php';
require_once __DIR__ . '/../../models/User.php';

// Set CORS headers
setCorsHeaders("POST");

// Get database connection
$database = new Database();
$db = $database->getConnection();

if (!$db) {
    sendDatabaseError();
}

// Get JSON input
$data = getJsonInput();

// Validate required fields
validateInputOrFail($data, ['email', 'password']);

// Validate email format
if (!isValidEmail($data->email)) {
    sendValidationError("Invalid email format");
}

// Create user instance and attempt login with role check
$user = new User($db);
$user->email = sanitizeString($data->email);
$user->password = $data->password;

// Login with admin role requirement
$result = $user->loginWithRole('admin');

if ($result['success']) {
    // Start session
    session_start();
    $_SESSION['user_id'] = $result['user']['id'];
    $_SESSION['user_email'] = $result['user']['email'];
    $_SESSION['user_role'] = $result['user']['role'];
    $_SESSION['user_name'] = $result['user']['full_name'];
    $_SESSION['is_admin'] = true;
    
    // Send success response
    sendSuccess("Admin login successful", [
        "user" => $result['user'],
        "session_id" => session_id()
    ]);
} else {
    sendUnauthorized($result['message']);
}
?>
