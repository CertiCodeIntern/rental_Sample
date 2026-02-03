<?php
/**
 * =====================================================
 * CORS CONFIGURATION
 * Sets Cross-Origin Resource Sharing headers
 * Include this at the top of all API endpoints
 * =====================================================
 */

/**
 * Set CORS headers for API responses
 * @param string $method - Allowed HTTP method(s)
 */
function setCorsHeaders($method = "POST, GET, OPTIONS") {
    // Allow requests from any origin (adjust for production)
    header("Access-Control-Allow-Origin: *");
    
    // Allowed methods
    header("Access-Control-Allow-Methods: " . $method);
    
    // Allowed headers
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    
    // Content type
    header("Content-Type: application/json; charset=UTF-8");
    
    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}

/**
 * Set CORS headers for production (specify allowed origins)
 * @param array $allowedOrigins - List of allowed origins
 */
function setCorsHeadersProduction($allowedOrigins = []) {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    
    if (in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: " . $origin);
    }
    
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    header("Access-Control-Allow-Credentials: true");
    header("Content-Type: application/json; charset=UTF-8");
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit();
    }
}
?>
