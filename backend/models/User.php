<?php
/**
 * =====================================================
 * USER MODEL
 * Handles user database operations
 * Used by both client and admin authentication
 * =====================================================
 */

class User {
    private $conn;
    private $table_name = "users";

    // User properties
    public $id;
    public $full_name;
    public $email;
    public $phone;
    public $password;
    public $role;
    public $created_at;
    public $updated_at;

    /**
     * Constructor
     * @param mysqli $db - Database connection
     */
    public function __construct($db) {
        $this->conn = $db;
    }

    /**
     * Register new user
     * @return array - Success/failure result
     */
    public function register() {
        // Check if email already exists
        if ($this->emailExists()) {
            return ["success" => false, "message" => "Email already exists"];
        }

        // Hash password
        $hashed_password = password_hash($this->password, PASSWORD_DEFAULT);

        // Insert query
        $query = "INSERT INTO " . $this->table_name . " 
                  (full_name, email, phone, password, role, created_at) 
                  VALUES (?, ?, ?, ?, ?, NOW())";

        $stmt = $this->conn->prepare($query);
        
        if (!$stmt) {
            return ["success" => false, "message" => "Query preparation failed"];
        }

        // Sanitize inputs
        $full_name = htmlspecialchars(strip_tags($this->full_name ?? ''));
        $email = htmlspecialchars(strip_tags($this->email));
        $phone = htmlspecialchars(strip_tags($this->phone ?? ''));
        $role = $this->role ?: 'customer';
        
        $stmt->bind_param("sssss", $full_name, $email, $phone, $hashed_password, $role);

        if ($stmt->execute()) {
            $this->id = $stmt->insert_id;
            $stmt->close();
            return ["success" => true, "message" => "User registered successfully"];
        } else {
            $error = $stmt->error;
            $stmt->close();
            return ["success" => false, "message" => "Registration failed: " . $error];
        }
    }

    /**
     * Login user
     * @return array - Success with user data or failure
     */
    public function login() {
        $query = "SELECT id, full_name, email, phone, password, role, created_at 
                  FROM " . $this->table_name . " 
                  WHERE email = ? 
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        
        if (!$stmt) {
            return ["success" => false, "message" => "Query preparation failed"];
        }

        $stmt->bind_param("s", $this->email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            
            // Verify password
            if (password_verify($this->password, $row['password'])) {
                // Don't return password in response
                unset($row['password']);
                $stmt->close();
                return ["success" => true, "user" => $row];
            }
        }
        
        $stmt->close();
        return ["success" => false, "message" => "Invalid email or password"];
    }

    /**
     * Login with role check (for admin)
     * @param string $requiredRole - Required role (admin, customer)
     * @return array - Success with user data or failure
     */
    public function loginWithRole($requiredRole) {
        $result = $this->login();
        
        if ($result['success']) {
            if ($result['user']['role'] !== $requiredRole) {
                return [
                    "success" => false, 
                    "message" => "Access denied. Invalid role."
                ];
            }
        }
        
        return $result;
    }

    /**
     * Check if email already exists
     * @return bool - True if email exists
     */
    public function emailExists() {
        $query = "SELECT id FROM " . $this->table_name . " WHERE email = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        
        if (!$stmt) {
            return false;
        }

        $stmt->bind_param("s", $this->email);
        $stmt->execute();
        $stmt->store_result();
        
        $exists = $stmt->num_rows > 0;
        $stmt->close();
        
        return $exists;
    }

    /**
     * Get user by email
     * @param string $email - User email
     * @return array|null - User data or null
     */
    public function getUserByEmail($email) {
        $query = "SELECT id, full_name, email, phone, role, created_at 
                  FROM " . $this->table_name . " 
                  WHERE email = ? 
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        
        if (!$stmt) {
            return null;
        }

        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();
        
        return $user;
    }

    /**
     * Get user by ID
     * @param int $id - User ID
     * @return array|null - User data or null
     */
    public function getUserById($id) {
        $query = "SELECT id, full_name, email, phone, role, created_at 
                  FROM " . $this->table_name . " 
                  WHERE id = ? 
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        
        if (!$stmt) {
            return null;
        }

        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();
        
        return $user;
    }

    /**
     * Update user profile
     * @return array - Success/failure result
     */
    public function updateProfile() {
        $query = "UPDATE " . $this->table_name . " 
                  SET full_name = ?, phone = ?, updated_at = NOW() 
                  WHERE id = ?";

        $stmt = $this->conn->prepare($query);
        
        if (!$stmt) {
            return ["success" => false, "message" => "Query preparation failed"];
        }

        $full_name = htmlspecialchars(strip_tags($this->full_name));
        $phone = htmlspecialchars(strip_tags($this->phone ?? ''));
        
        $stmt->bind_param("ssi", $full_name, $phone, $this->id);

        if ($stmt->execute()) {
            $stmt->close();
            return ["success" => true, "message" => "Profile updated successfully"];
        } else {
            $error = $stmt->error;
            $stmt->close();
            return ["success" => false, "message" => "Update failed: " . $error];
        }
    }

    /**
     * Change user password
     * @param string $currentPassword - Current password for verification
     * @param string $newPassword - New password
     * @return array - Success/failure result
     */
    public function changePassword($currentPassword, $newPassword) {
        // First verify current password
        $query = "SELECT password FROM " . $this->table_name . " WHERE id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        
        if (!$stmt) {
            return ["success" => false, "message" => "Query preparation failed"];
        }

        $stmt->bind_param("i", $this->id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            $stmt->close();
            return ["success" => false, "message" => "User not found"];
        }

        $row = $result->fetch_assoc();
        $stmt->close();

        // Verify current password
        if (!password_verify($currentPassword, $row['password'])) {
            return ["success" => false, "message" => "Current password is incorrect"];
        }

        // Update to new password
        $newHashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        
        $updateQuery = "UPDATE " . $this->table_name . " 
                        SET password = ?, updated_at = NOW() 
                        WHERE id = ?";
        
        $updateStmt = $this->conn->prepare($updateQuery);
        
        if (!$updateStmt) {
            return ["success" => false, "message" => "Query preparation failed"];
        }

        $updateStmt->bind_param("si", $newHashedPassword, $this->id);

        if ($updateStmt->execute()) {
            $updateStmt->close();
            return ["success" => true, "message" => "Password changed successfully"];
        } else {
            $error = $updateStmt->error;
            $updateStmt->close();
            return ["success" => false, "message" => "Password change failed: " . $error];
        }
    }
}
?>
