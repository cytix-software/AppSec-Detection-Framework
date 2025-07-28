<?php
// CWE 539 - Use of Persistent Cookies Containing Sensitive Information
// This script demonstrates a vulnerability where sensitive information (a password) is stored in a persistent cookie.


$message = '';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'] ?? '';
    if ($password !== '') {
        // VULNERABLE: Store password in a persistent cookie (valid for 30 days)
        setcookie('user_password', $password, time() + 60*60*24*30, "/");
        $message = "<span style='color:green;'>Password stored in persistent cookie!</span>";
    }
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
    <h1>CWE-539: Persistent Cookie Containing Sensitive Information</h1>
    <p class="vulnerable">This app is vulnerable: it stores sensitive information in a persistent cookie!</p>
    <!-- Password input form -->
    <form method="post">
        <label for="password">Enter a password (will be stored in a persistent cookie):</label><br>
        <input type="text" id="password" name="password" required>
        <button type="submit">Login</button>
    </form>
    <?php if (!empty($msg)) echo "<div>$msg</div>"; ?>
</body>
</html> 