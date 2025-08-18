<?php
// CWE-425 Direct Request ('Forced Browsing')
// VULNERABLE: Access to a secret page is controlled by a authorisation check in index.php, which can be bypassed by directly accessing the secret.txt file.

$username = '';
$password = '';
$message = '';

// check if the form is submitted, and validates credentials
if (isset($_POST['username']) && isset($_POST['password'])) {
    if ($_POST['username'] === 'admin' && $_POST['password'] === 'secret_password') {
        // if credentials are correct, redirect to the secret page (no access controlsfor secret.txt)
        header('Location: /secret.txt');
        exit;
    }
    else {
        $message = "Invalid credentials!";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>CWE-425: Direct Request ('Forced Browsing')</title>
</head>
<body>
    <h1>CWE-425: Direct Request ('Forced Browsing')</h1>
    <h2>Enter Admin Credentials to access '/secret.txt'.</h2>
    <form action="" method="post">
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username"><br>
        <label for="password">Password:</label><br>
        <input type="text" id="password" name="password"><br><br>
        <input type="submit" value="Submit">
    </form>
    <?php if ($message): ?>
        <div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">
            <?= $message ?><br>
        </div>
    <?php endif; ?>
</body>
</html> 