<?php
// Simulate user data
$userData = [
    'id' => 1,
    'username' => 'admin',
    'apiKey' => 'FAKE_API_KEY_1234567890',
    'creditCard' => [
        'number' => '4111111111111111',
        'expiry' => '12/25',
        'cvv' => '123'
    ]
];

// Add random transaction data
$userData['transaction'] = [
    'id' => 'TX' . rand(100000, 999999),
    'amount' => rand(10, 1000),
    'timestamp' => date('Y-m-d H:i:s'),
    'status' => 'completed'
];

// Store data in a log file
$logEntry = json_encode($userData, JSON_PRETTY_PRINT) . "\n---\n";
file_put_contents('debug.log', $logEntry, FILE_APPEND);

// Read the last few entries to display
$logContent = file_exists('debug.log') ? file_get_contents('debug.log') : '';
$entries = array_filter(explode('---', $logContent));
$lastEntries = array_slice($entries, -5); // Show last 5 entries
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test 55</title>
</head>
<body>
    <h1>Test 55</h1>
    <p>New transaction data has been automatically stored in the log file.</p>
    
    <h2>Recent Log Entries:</h2>
    <?php foreach ($lastEntries as $entry): ?>
        <pre><?php echo htmlspecialchars($entry); ?></pre>
    <?php endforeach; ?>
    </body>
</html>