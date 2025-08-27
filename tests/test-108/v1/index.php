<?php
session_start();

$users = [
    ["username" => "alice", "password" => "password1", "status" => "active"],
    ["username" => "bob", "password" => "password2", "status" => "suspended"]
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    foreach ($users as $user) {
        if ($user['username'] === $username && $user['password'] === $password) {
            $_SESSION['username'] = $username;
            break;
        }
    }
}

if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: index.php");
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Login Page</title>
</head>
<body>
    
    <?php if (isset($_SESSION['username'])): ?>
        <h1>Account Information</h1>
        <h2>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?>!</h2>
        <p>Your account status is currently 'active'.</p>
        <a href="#">View customer information (example action only for logged in users whose accounts are active)</a>
        <a href="?logout=1">Logout</a>
    <?php else: ?>
        <h1>Login Page</h1>
        <form method="post">
            <input name="username" placeholder="Username" required>
            <input name="password" type="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
    <?php endif; ?>
</body>
</html>