<?php
setcookie('session_token', 'sensitive_session_value', [
    'expires' => time() + 3600,
    'path' => '/',
    'secure' => false,
    'httponly' => false
]);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Test 45</title>
</head>
<body>
    <h1>Test 45</h1>
    <script>document.write(document.cookie)</script>
</body>
</html>