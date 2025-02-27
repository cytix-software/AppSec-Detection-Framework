<?php
// Start a session and set a session cookie WITHOUT Secure flag
session_start();

// Set a sensitive cookie without the Secure attribute
setcookie("session_id", session_id(), [
    "httponly" => true,  // Protects against JavaScript access (but still vulnerable)
    "samesite" => "Strict" // Helps prevent CSRF attacks
]);

?>

<!DOCTYPE html>
<html>
<head>
    <title>Test 39</title>
</head>
</html>
