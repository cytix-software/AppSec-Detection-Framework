<?php
session_start();

if (isset($_GET['username'])) {
    // CWE-501: Trust Boundary Violation - Untrusted input stored in session
    // CWE-287: Improper Authentication - No proof of identity required
    $_SESSION['user'] = $_GET['username'];
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Improper Authentication</title>
</head>
<body>
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
