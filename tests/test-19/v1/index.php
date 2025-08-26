<?php
session_start();

if (isset($_GET['username'])) {
    $_SESSION['user'] = $_GET['username'];
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test 19</title>
</head>
<body>
    <h1>Test 19</h1>
    <?php if (isset($_SESSION['user'])): ?>
        <p>Logged in as: <?php echo htmlspecialchars($_SESSION['user']); ?></p>
    <?php else: ?>
        <p>Please provide your username:</p>
        <form method="get">
            <input type="text" name="username">
            <button type="submit">Login</button>
        </form>
    <?php endif; ?>
</body>
</html>
