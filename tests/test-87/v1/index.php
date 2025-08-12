<?php
// CWE-331: Insufficient Entropy
// VULNERABLE: Session ID generation is predictable due to fixed seed (user id)

function generateSessionID($userID) {
    srand($userID); // Predictable seed
    return rand();
}

$userID = isset($_GET['user']) ? intval($_GET['user']) : 42;
$sessionID = generateSessionID($userID);

echo "<h2>CWE-331: Insufficient Entropy</h2>\n";
echo "<p><strong>User ID:</strong> " . htmlspecialchars($userID) . "</p>\n";
echo "<p><strong>Generated Session ID:</strong> " . htmlspecialchars($sessionID) . "</p>\n";
echo "<p style='color:red'><strong>Vulnerability:</strong> The session ID is predictable because the PRNG is seeded with the user ID. An attacker can predict any user's session ID and hijack the session.</p>\n";
?>
