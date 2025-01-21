<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $usersFile = __DIR__ . '/users.txt';
    $passwordsFile = __DIR__ . '/passwords.txt';
    $users = file($usersFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $passwords = file($passwordsFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    if (in_array($username, $users)) {
        $index = array_search($username, $users);
        if ($passwords[$index] === $password) {
            echo "<h1>Login Successful! Welcome, $username.</h1>";
        } else {
            echo "<h1>Incorrect password.</h1>";
        }
    } else {
        echo "<h1>Username not found.</h1>";
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>
<body>
    <h1>Login</h1>
    <form method="POST" action="index.php">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required>
        <br>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
        <br>
        <button type="submit">Login</button>
    </form>
</body>
</html>
