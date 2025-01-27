<?php
// Simulate a weak password hashing mechanism (SHA-1)
session_start();

// Simulated stored password hash (unsafe, SHA-1 without salt)
$stored_hash = "5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8"; // This is the SHA-1 hash of "password"

// Function to simulate the login process
function checkPassword($inputPassword) {
    global $stored_hash;
    
    // Simulate hashing the input password with SHA-1 (weak hash)
    $hashedInput = sha1($inputPassword);

    // Check if the hashed input matches the stored hash
    if ($hashedInput === $stored_hash) {
        return true; // Password match
    } else {
        return false; // Password mismatch
    }
}

// Handle form submission for login
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $password = $_POST['password'];

    if (checkPassword($password)) {
        $_SESSION['logged_in'] = true;
        echo "Login successful!";
    } else {
        echo "Invalid password.";
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vulnerable Login System</title>
</head>
<body>
    <h1>Login</h1>
    <form method="POST" action="">
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
        <button type="submit">Login</button>
    </form>
</body>
</html>
