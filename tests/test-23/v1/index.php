<?php
session_start();

// Handle login submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $_SESSION["user"] = $_POST["username"];
    echo "<p>Logged in as: " . htmlspecialchars($_SESSION["user"]) . "</p>";
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Test 23</title>
</head>
<body>
    <h1>Test 23</h1>
    <h2>Login</h2>
    <form method="POST" action="">
        <label>Username: <input type="text" name="username"></label><br>
        <label>Password: <input type="password" name="password"></label><br>
        <input type="submit" value="Login">
    </form>
</body>
</html>
