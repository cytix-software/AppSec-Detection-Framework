<?php
// Simulate a login (user's ID in plain text is set)
$userID = "user123"; 
// Store the user ID in a cookie in cleartext
setcookie("userID", $userID, time() + 3600, "/"); // Cookie valid for 1 hour

// Check if the cookie is set and display the stored value
if (isset($_COOKIE['userID'])) {
    echo "Welcome back, user ID: " . $_COOKIE['userID'];
} else {
    echo "Please log in.";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test 41</title>
</head>
</html>
