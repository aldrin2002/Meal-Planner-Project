<?php
// Add the following at the top of your PHP files, before any output is sent:
header("Access-Control-Allow-Origin: "); // Allows all origins. You can restrict this to your frontend domain for added security.
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Allow HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow these headers

// Handle OPTIONS request (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200); // Respond with 200 OK for OPTIONS requests
    exit;
}

require_once 'global.php'; // Including your global database connection

class Api extends GlobalMethods {
    private $mysqli;

    public function __construct($mysqli) {
        $this->mysqli = $mysqli; // Ensure $mysqli is passed to the class constructor
    }

    // User registration
    public function register($email, $username, $password) {
        // Validate input
        if (empty($email) || empty($username) || empty($password)) {
            return json_encode(['error' => 'All fields are required.']);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return json_encode(['error' => 'Invalid email format.']);
        }

        // Hash password before storing
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Check if email or username already exists
        $query = "SELECT * FROM users WHERE email = ? OR username = ?";
        $stmt = $this->mysqli->prepare($query);
        
        // Bind the parameters
        $stmt->bind_param("ss", $email, $username);
        $stmt->execute();
        
        // Fetch the result
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if ($user) {
            return json_encode(['error' => 'Email or username already exists.']);
        }

        // Insert new user into the database
        $query = "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";
        $stmt = $this->mysqli->prepare($query);

        // Bind the parameters again
        $stmt->bind_param("sss", $email, $username, $hashedPassword);
        $stmt->execute();
        
        // Check if the user was successfully created
        if ($stmt->affected_rows > 0) {
            http_response_code(200);
            return json_encode(['success' => 'Registration successful.']);
        } else {
            http_response_code(500);
            return json_encode(['error' => 'An error occurred during registration. Please try again later.']);
        }
    }

    // User login
    public function login($email, $password) {
        // Validate input
        if (empty($email) || empty($password)) {
            return json_encode(['error' => 'Email and password are required.']);
        }

        // Check if user exists with the given email
        $query = "SELECT * FROM users WHERE email = ?";
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if (!$user) {
            return json_encode(['error' => 'User not found.']);
        }

        // Verify password
        if (!password_verify($password, $user['password'])) {
            return json_encode(['error' => 'Incorrect password.']);
        }

        // Generate authentication token (using user ID)
        $token = bin2hex(random_bytes(16)); // Simple token generation
        $query = "UPDATE users SET auth_token = ? WHERE id = ?";
        $stmt = $this->mysqli->prepare($query);
        $stmt->bind_param("si", $token, $user['id']);
        $stmt->execute();

        // Check if the token was successfully updated
        if ($stmt->affected_rows > 0) {
            return json_encode(['success' => 'Login successful.', 'token' => $token]);
        } else {
            return json_encode(['error' => 'Failed to generate authentication token.']);
        }
    }
}
?>
