<?php
// Simulated stored password hash

// Function to simulate the login process
function checkPassword($inputPassword) {
    $salt = "12345";
    $hashedInput = sha1($salt . $inputPassword); // Combine salt and password
    if ($hashedInput === "126d2388a03203a8c9c83b5a6af3b85426b85720") {
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
