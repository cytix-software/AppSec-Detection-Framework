<?php
// Vulnerable to CWE-538: Insertion of Sensitive Information into Externally-Accessible File or Directory
// This application stores sensitive information in a publicly accessible file

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

// Vulnerable: Store sensitive data in a publicly accessible log file
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
    <title>CWE-538 Test</title>
    <style>
        pre { background: #f4f4f4; padding: 10px; }
    </style>
</head>
<body>
    <h1>Sensitive Data Storage Test</h1>
    <p>New transaction data has been automatically stored in the log file.</p>
    
    <h2>Recent Log Entries:</h2>
    <?php foreach ($lastEntries as $entry): ?>
        <pre><?php echo htmlspecialchars($entry); ?></pre>
    <?php endforeach; ?>
    
    <p>Note: This test stores sensitive data in a publicly accessible file at <a href="debug.log">debug.log</a></p>
</body>
</html> 