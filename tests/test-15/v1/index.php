<?php
// Simulated stored password hash (SHA-1 with no salt)
$stored_hash = "5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8";

// Function to simulate the login process
function checkPassword($inputPassword) {
    global $stored_hash;
    $hashedInput = sha1($inputPassword);
    if ($hashedInput === $stored_hash) {
        return true; 
    } else {
        return false;
    }
}

// Handle form submission for login
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $password = $_POST['password'];
    if (checkPassword($password)) {
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
    <title>Login System</title>
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
