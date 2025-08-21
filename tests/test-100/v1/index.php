<?php
$users = [
    'user1' => 'password1',
    'user2' => 'password2',
    'user3' => 'password3'
];

$cookie_name = "authenticated";
$cookie_value = "false";

setcookie($cookie_name, $cookie_value, time() + (86400 * 1), "/"); // Set cookie for 1 day
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test-100</title>
</head>
<body>
    <h1>Test-100</h1>
    <?php
        // if authenticated cookie is set to true, display user credentials
        if (isset($_COOKIE[$cookie_name]) && $_COOKIE[$cookie_name] === "true") {
            echo "You are authenticated.<br>";
            echo "User credentials: " . htmlspecialchars(json_encode($users)) . "<br>";
        } else {
            echo "You are not authenticated (no cookie is set or value is false).<br>";
}
?>

