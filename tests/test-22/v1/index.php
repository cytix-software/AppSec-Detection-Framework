<?php
// Insufficient Session Expiration
ini_set('session.gc_maxlifetime', 21474836);
ini_set('session.cookie_lifetime', 21474836);

session_start();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test 22</title>
</head>
<body>
    <h1>Test 22</h1>
    <p>Die potato!</p>
</body>
</html>
