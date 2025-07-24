<?php
// This script includes a file containing sensitive credentials and simulates a login process.

include('database.inc'); // Include file with database credentials

// Dummy function to simulate connecting to a database using credentials from database.inc
function connectToDB($dbName, $dbPassword) {
    return new class {
        // Dummy authentication method (always returns true)
        function authenticateUser($username, $password) {

            return true;
        }
    };
}


$username = $_POST['username'] ?? '';
$password = $_POST['password'] ?? '';

$db = connectToDB($dbName, $dbPassword);

// If credentials are submitted, attempt authentication
if ($username && $password) {
    if ($db->authenticateUser($username, $password)) {
        echo "Login successful!";
    } else {
        echo "Login failed.";
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
</head>
<body>
    <!-- Simple login form -->
    <form method="post">
        <label>Username: <input type="text" name="username" required></label><br>
        <label>Password: <input type="password" name="password" required></label><br>
        <button type="submit">Login</button>
    </form>
</body>
</html> 