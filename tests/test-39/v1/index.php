<?php
// Start a session and set a session cookie
session_start();

// Set a sensitive cookie
setcookie("session_id", session_id(), [
    "httponly" => true,  // Protects against JavaScript access
    "samesite" => "Strict" // Helps prevent CSRF attacks
]);

?>

<!DOCTYPE html>
<html>
<head>
    <title>Test 39</title>
</head>
<body>
    <h1>Test 39</h1>
</body>
</html>
