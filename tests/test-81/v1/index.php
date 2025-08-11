<?php
// CWE-322: Key Exchange without Entity Authentication (Vulnerable Example)
// This simulates a key exchange with no authentication of the remote party

// Simulated public parameters (insecure, hardcoded for demo)
$prime = 23;
$base = 5;

// Each party picks a secret (insecure, hardcoded for demo)
$aliceSecret = 6; // Alice's private key
$bobPublic = 8;   // Bob's public value (should be received from Bob, but could be from attacker)

// Alice computes her public value
$alicePublic = pow($base, $aliceSecret) % $prime;

// Alice computes shared key using Bob's (possibly attacker’s) public value
$sharedKey = pow($bobPublic, $aliceSecret) % $prime;

echo "<h2>CWE-322: Key Exchange without Entity Authentication</h2>\n";
echo "<p>Shared key (computed without authenticating the other party): <strong>$sharedKey</strong></p>\n";
?>