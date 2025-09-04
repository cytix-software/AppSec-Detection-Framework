<?php

// generates an account ID using the current time as the seed
function generateAccountID() {
    srand(time()); 
    return rand();
}

$accountID = generateAccountID();

// Show the current time used for seeding
$seedTime = date('Y-m-d H:i:s', time());

echo "<h1>Test 88</h1>\n";
echo "<p><strong>Seed (current time):</strong> " . htmlspecialchars($seedTime) . "</p>\n";
echo "<p><strong>Generated Account ID:</strong> " . htmlspecialchars($accountID) . "</p>\n";
?>
