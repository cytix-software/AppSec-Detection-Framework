<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['password'])) {
    setcookie('user_password', $_POST['password'], time() + 60*60*24*30, "/");
    $msg = 'Password stored in persistent cookie.';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CWE-539: Persistent Cookie Sensitive Info</title>
</head>
<body>
    <h1>CWE-539: Persistent Cookie Contains Sensitive Info</h1>
    <form method="post">
        <label for="password">Enter a password (will be stored in a persistent cookie):</label><br>
        <input type="text" id="password" name="password" required>
        <button type="submit">Login</button>
    </form>
    <?php if (!empty($msg)) echo "<div>$msg</div>"; ?>
</body>
</html> 