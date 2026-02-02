<?php
/**
 * =====================================================
 * INPUT VALIDATION HELPERS
 * Reusable validation functions for API inputs
 * =====================================================
 */

/**
 * Validate email format
 * @param string $email - Email to validate
 * @return bool - True if valid
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate password strength
 * @param string $password - Password to validate
 * @param int $minLength - Minimum length (default 6)
 * @return array - [valid => bool, message => string]
 */
function validatePassword($password, $minLength = 6) {
    if (strlen($password) < $minLength) {
        return [
            "valid" => false,
            "message" => "Password must be at least {$minLength} characters"
        ];
    }
    
    return ["valid" => true, "message" => ""];
}

/**
 * Validate passwords match
 * @param string $password - Password
 * @param string $confirmPassword - Confirmation password
 * @return bool - True if they match
 */
function passwordsMatch($password, $confirmPassword) {
    return $password === $confirmPassword;
}

/**
 * Sanitize string input
 * @param string $input - Input to sanitize
 * @return string - Sanitized string
 */
function sanitizeString($input) {
    return htmlspecialchars(strip_tags(trim($input)));
}

/**
 * Validate required fields
 * @param object $data - Input data object
 * @param array $requiredFields - List of required field names
 * @return array - [valid => bool, missing => array]
 */
function validateRequired($data, $requiredFields) {
    $missing = [];
    
    foreach ($requiredFields as $field) {
        if (!isset($data->$field) || empty(trim($data->$field))) {
            $missing[] = $field;
        }
    }
    
    return [
        "valid" => empty($missing),
        "missing" => $missing
    ];
}

/**
 * Validate phone number format (basic)
 * @param string $phone - Phone number
 * @return bool - True if valid format
 */
function isValidPhone($phone) {
    // Remove common formatting characters
    $cleaned = preg_replace('/[\s\-\(\)\+]/', '', $phone);
    
    // Check if remaining characters are digits and length is reasonable
    return preg_match('/^\d{10,15}$/', $cleaned);
}

/**
 * Get JSON input from request body
 * @return object|null - Decoded JSON or null
 */
function getJsonInput() {
    $rawInput = file_get_contents("php://input");
    return json_decode($rawInput);
}

/**
 * Validate input and send error if invalid
 * @param object $data - Input data
 * @param array $requiredFields - Required fields
 */
function validateInputOrFail($data, $requiredFields) {
    if (!$data) {
        include_once __DIR__ . '/response.php';
        sendValidationError("Invalid JSON input");
    }
    
    $result = validateRequired($data, $requiredFields);
    
    if (!$result['valid']) {
        include_once __DIR__ . '/response.php';
        sendValidationError(
            "Missing required fields: " . implode(", ", $result['missing']),
            ["missing_fields" => $result['missing']]
        );
    }
}
?>
