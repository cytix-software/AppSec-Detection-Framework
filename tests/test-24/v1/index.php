
<?php
// Based on example 1 for cwe-359.
// logs personal user data and plaintext passwords to the filesystem insecurely.

$logFile = "user_log.txt";

// Simulated database of users 
$users = [
    "admin" => "password123",
    "user1" => "mypassword",
    "user2" => "securepass"
];

$records = [
    "admin" => "10 Downing Street, London",
    "user1" => "The white house, Washington DC",
    "user2" => "Kremlin, Moscow"
];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST["username"];
    $password = $_POST["password"];

    if (isset($users[$username]) && $users[$username] === $password) {
        file_put_contents($logFile, "User: $username | Password: $password | Record Data: $records[$username] | IP: " . $_SERVER["REMOTE_ADDR"] . "\n", FILE_APPEND);
        echo "<h2>Welcome, $username!</h2>"; 
    } else {
        echo "<p style='color:red;'>Invalid credentials</p>";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Test 24</title>
</head>
<body>
    <h1>Login</h1>
    <form method="POST">
        Username: <input type="text" name="username"><br>
        Password: <input type="password" name="password"><br>
        <input type="submit" value="Login">
    </form>
</body>
</html>
