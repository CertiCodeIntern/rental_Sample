<?php
/**
 * =====================================================
 * CLIENT REGISTRATION ENDPOINT
 * POST /backend/client/auth/register.php
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
validateInputOrFail($data, ['email', 'password', 'confirm_password']);

// Validate email format
if (!isValidEmail($data->email)) {
    sendValidationError("Invalid email format");
}

// Check passwords match
if (!passwordsMatch($data->password, $data->confirm_password)) {
    sendValidationError("Passwords do not match");
}

// Validate password strength
$passwordCheck = validatePassword($data->password, 6);
if (!$passwordCheck['valid']) {
    sendValidationError($passwordCheck['message']);
}

// Create user instance
$user = new User($db);
$user->full_name = $data->full_name ?? '';
$user->email = sanitizeString($data->email);
$user->phone = $data->phone ?? '';
$user->password = $data->password;
$user->role = 'customer'; // Client users are always customers

// Attempt registration
$result = $user->register();

if ($result['success']) {
    // Get created user data
    $userData = $user->getUserByEmail($user->email);
    
    // Send success response
    sendSuccess("Registration successful", [
        "user" => $userData
    ], 201);
} else {
    sendError($result['message']);
}
?>
