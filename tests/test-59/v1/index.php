<?php
// This script includes a file containing sensitive credentials and simulates a login process.
// CWE 540: Inclusion of Sensitive Information in Source Code & CWE 541: Inclusion of Sensitive Information in an Include File
// also CWE 259: Use of Hard-coded Password

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
<html>
<head>
    <title>Test 59</title>
</head>
<body>
    <h1>Test 59</h1>
    <!-- Simple login form -->
    <form method="post">
        <label>Username: <input type="text" name="username" required></label><br>
        <label>Password: <input type="password" name="password" required></label><br>
        <button type="submit">Login</button>
    </form>
</body>
</html>