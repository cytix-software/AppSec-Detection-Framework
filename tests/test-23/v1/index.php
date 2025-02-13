<?php
session_start(); // cwe-384 vulnerable to session fixation.

// Handle login submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $_SESSION["user"] = $_POST["username"]; // Does not regenerate session ID
    echo "<p>Logged in as: " . htmlspecialchars($_SESSION["user"]) . "</p>";
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Vulnerable Login - Session Fixation</title>
</head>
<body>
    <h2>Login</h2>
    <form method="POST" action="">
        <label>Username: <input type="text" name="username"></label><br>
        <label>Password: <input type="password" name="password"></label><br>
        <input type="submit" value="Login">
    </form>
</body>
</html>
