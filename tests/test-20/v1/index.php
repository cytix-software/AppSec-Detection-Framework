<?php
session_start();

function loginUser($username, $password) {
    if ($username == 'admin' && $password == 'password123') {
        $_SESSION['logged_in'] = true;
        echo "Login successful.";
        return true;
    } else {
        echo "Login failed.";
        return false;
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    if (loginUser($username, $password)) {
       echo "Proceed";
    } else {
        echo "Retry.";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Page</title>
</head>
<body>
    <form method="post">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username">
        <br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password">
        <br>
        <button type="submit">Login</button>
    </form>
</body>
</html>
