<?php
// a simple login form that simulates a database connection failure

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    $db_connected = false;

    if (!$db_connected) {
        $sql = "SELECT * FROM users WHERE username = '$username' AND password = '$password'";
        die("Database connection failed!<br>SQL: $sql");
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test 60</title>
</head>
<body>
    <h1>Test 60</h1>
    <h2>Login</h2>
    <form method="post">
        <label>Username: <input type="text" name="username" required></label><br>
        <label>Password: <input type="password" name="password" required></label><br>
        <button type="submit">Login</button>
    </form>
</body>
</html>