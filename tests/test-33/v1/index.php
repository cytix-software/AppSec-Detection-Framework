<?php

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['user'], $_GET['pass'], $_GET['checkpass'])) {
    $user = $_GET['user'];
    $pass = $_GET['pass'];
    $checkpass = $_GET['checkpass'];

    if ($pass == $checkpass) {
        echo "<h3>Password for user " . htmlspecialchars($user) . " has been changed to " . htmlspecialchars($pass) . ".</h3>";
    } else {
        echo "<h3>Passwords do not match!</h3>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Change</title>
</head>
<body>
    <h1>Change Password Form</h1>
    <form action="index.php" method="GET">
        <label for="user">Username:</label>
        <input type="text" id="user" name="user" required><br><br>

        <label for="pass">New Password:</label>
        <input type="password" id="pass" name="pass" required><br><br>

        <label for="checkpass">Confirm Password:</label>
        <input type="password" id="checkpass" name="checkpass" required><br><br>

        <input type="submit" value="Change Password">
    </form>
</body>
</html>
