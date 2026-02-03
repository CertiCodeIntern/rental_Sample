<?php
/**
 * =====================================================
 * JSON RESPONSE HELPERS
 * Standardized API response functions
 * =====================================================
 */

/**
 * Send success response
 * @param string $message - Success message
 * @param array $data - Additional data to include
 * @param int $code - HTTP status code (default 200)
 */
function sendSuccess($message, $data = [], $code = 200) {
    http_response_code($code);
    echo json_encode(array_merge(
        ["success" => true, "message" => $message],
        $data
    ));
    exit();
}

/**
 * Send error response
 * @param string $message - Error message
 * @param int $code - HTTP status code (default 400)
 * @param array $data - Additional error data
 */
function sendError($message, $code = 400, $data = []) {
    http_response_code($code);
    echo json_encode(array_merge(
        ["success" => false, "message" => $message],
        $data
    ));
    exit();
}

/**
 * Send database error response
 * @param string $customMessage - Optional custom message
 */
function sendDatabaseError($customMessage = "Database connection failed") {
    sendError($customMessage, 503);
}

/**
 * Send validation error response
 * @param string $message - Validation error message
 * @param array $errors - Field-specific errors
 */
function sendValidationError($message, $errors = []) {
    $data = !empty($errors) ? ["errors" => $errors] : [];
    sendError($message, 400, $data);
}

/**
 * Send unauthorized response
 * @param string $message - Auth error message
 */
function sendUnauthorized($message = "Unauthorized access") {
    sendError($message, 401);
}

/**
 * Send forbidden response
 * @param string $message - Forbidden message
 */
function sendForbidden($message = "Access forbidden") {
    sendError($message, 403);
}

/**
 * Send not found response
 * @param string $message - Not found message
 */
function sendNotFound($message = "Resource not found") {
    sendError($message, 404);
}
?>
