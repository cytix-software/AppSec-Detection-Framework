<?php
// CWE-337: Predictable Seed in Pseudo-Random Number Generator (PRNG)
// VULNERABLE: Account ID generation is predictable due to time-based seed

function generateAccountID() {
    srand(time()); // Predictable seed (current time)
    return rand();
}

$accountID = generateAccountID();

// Show the current time used for seeding
$seedTime = date('Y-m-d H:i:s', time());

echo "<h2>CWE-337: Predictable Seed in PRNG</h2>\n";
echo "<p><strong>Seed (current time):</strong> " . htmlspecialchars($seedTime) . "</p>\n";
echo "<p><strong>Generated Account ID:</strong> " . htmlspecialchars($accountID) . "</p>\n";
echo "<p style='color:red'><strong>Vulnerability:</strong> The account ID is predictable because the PRNG is seeded with the current time. An attacker can guess the seed and predict the account ID.</p>\n";
?>
