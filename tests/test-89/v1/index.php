<?php
// CWE-340: Generation of Predictable Numbers or Identifiers
// VULNERABLE: Seed is a fixed number which gets incremeneted by one each time, session ID's generated are predictable.
$seed = 324;

function generateSessionID(&$seed) {
    srand($seed);
    $session_id = rand();
    $seed += 1;
    return $session_id;
}

$user1_session_id = generateSessionID($seed);

echo "<h2>CWE-340: Generation of Predictable Numbers or Identifiers</h2>";
echo "<p>Users 1's session ID: " . htmlspecialchars($user1_session_id) . "</p>\n" ;
echo "<p style='color:red'><strong>VULNERABLE:</strong> Seed for the rand() function is a fixed number and gets incremented by one each time, it is now: " . htmlspecialchars($seed) . "</p>\n";
?>