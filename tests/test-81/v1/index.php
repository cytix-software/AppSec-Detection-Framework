<?php
// Simulates a key exchange

// public parameters
$prime = 23;
$base = 5;

// Each party picks a secret
$aliceSecret = 6; // Alice's private key
$bobPublic = 8;   // Bob's public value, received from Bob

// Alice computes her public value
$alicePublic = pow($base, $aliceSecret) % $prime;

// Alice computes shared key using Bob's public value
$sharedKey = pow($bobPublic, $aliceSecret) % $prime;

echo "<h1>Test 81</h1>\n";
echo "<p><strong>Shared key:</strong> <strong>" . htmlspecialchars($sharedKey) . "</strong></p>\n";
?>