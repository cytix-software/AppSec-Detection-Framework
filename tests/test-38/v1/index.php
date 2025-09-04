<!DOCTYPE html>
<html>
<head>
    <title>Test 38</title>
</head>
<body>
    <h1>Test 38</h1>
    <?php
    // Approved IP address for authentication (assumed trusted)
    $approved_ip = "192.168.1.100";

    // Get the user's IP address from the request
    $user_ip = $_SERVER['REMOTE_ADDR'];

    // Check if the user's IP matches the approved IP
    if ($user_ip === $approved_ip) {
        echo "Authentication successful. Welcome, admin!";
    } else {
        echo "Access denied. Unauthorized user.";
    }
    ?>
</body>
</html>