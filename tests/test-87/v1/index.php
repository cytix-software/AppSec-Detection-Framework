<?php

// uses the user ID as the seed for to generate a session ID
function generateSessionID($userID) {
    srand($userID);
    return rand();
}

$userID = isset($_GET['user']) ? intval($_GET['user']) : 42;
$sessionID = generateSessionID($userID);

echo "<h1>Test 87</h1>\n";
echo "<p><strong>User ID:</strong> " . htmlspecialchars($userID) . "</p>\n";
echo "<p><strong>Generated Session ID:</strong> " . htmlspecialchars($sessionID) . "</p>\n";
?>
