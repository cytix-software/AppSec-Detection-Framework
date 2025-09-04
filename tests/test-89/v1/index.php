<?php
$seed = 324;

// generates a session ID based on the seed, incrementing the seed each time
function generateSessionID(&$seed) {
    srand($seed);
    $session_id = rand();
    $seed += 1;
    return $session_id;
}

$user1_session_id = generateSessionID($seed);

echo "<h1>Test 89</h1>";
echo "<p>User 1's session ID: " . htmlspecialchars($user1_session_id) . "</p>\n";