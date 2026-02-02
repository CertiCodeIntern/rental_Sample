<?php
/**
 * =====================================================
 * DATABASE CONNECTION CLASS
 * Handles MySQL database connection using MySQLi
 * =====================================================
 */

class Database {
    // Database credentials - Update these for your environment
    private $host = "localhost";
    private $db_name = "rental_system";
    private $username = "root";          // XAMPP default
    private $password = "";              // XAMPP default (empty)
    private $port = 3306;                // MySQL default port
    
    public $conn;

    /**
     * Get database connection
     * @return mysqli|null Connection object or null on failure
     */
    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new mysqli(
                $this->host,
                $this->username,
                $this->password,
                $this->db_name,
                $this->port
            );
            
            // Check connection
            if ($this->conn->connect_error) {
                throw new Exception("Connection failed: " . $this->conn->connect_error);
            }
            
            // Set charset to UTF-8 for proper encoding
            $this->conn->set_charset("utf8mb4");
            
        } catch(Exception $exception) {
            error_log("Database connection error: " . $exception->getMessage());
            return null;
        }

        return $this->conn;
    }

    /**
     * Close database connection
     */
    public function closeConnection() {
        if ($this->conn) {
            $this->conn->close();
        }
    }
}
?>
