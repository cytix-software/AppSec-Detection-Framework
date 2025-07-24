<?php
// CWE-201: Insertion of Sensitive Information Into Sent Data (Error Message Reveals Sensitive Data)

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    // Simulate a database connection failure
    $db_connected = false;

    if (!$db_connected) {
        // VULNERABLE: Exposes sensitive details in error message, specifically the SQL query and the username and password inputtted.
        $sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
        die("Database connection failed!<br>SQL: $sql");
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CWE-201: Insertion of Sensitive Information Into Sent Data</title>
</head>
<body>
    <h1>Login</h1>
    <form method="post">
        <label>Username: <input type="text" name="username" required></label><br>
        <label>Password: <input type="password" name="password" required></label><br>
        <button type="submit">Login</button>
    </form>
</body>
</html> 