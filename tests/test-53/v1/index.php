<?php
// Simulate user authentication
session_start();
if (!isset($_SESSION['user'])) {
    $_SESSION['user'] = [
        'id' => 1,
        'username' => 'admin',
        'role' => 'administrator',
        'apiKey' => 'FAKE_API_KEY_1234567890'
    ];
}

// Set cache control headers to cache everything
header('Cache-Control: public, max-age=31536000'); // Cache for 1 year
header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', time() + 31536000)); // Expires in 1 year
header('Pragma: public'); // Explicitly allow caching
header('Content-Type: application/json');

// Return user data that will be cached by the browser
echo json_encode([
    'status' => 'success',
    'user' => $_SESSION['user'],
    'sensitiveData' => [
        'accountNumber' => '1234567890',
        'balance' => 10000.00,
        'lastTransaction' => '2024-03-20T10:00:00Z',
        'creditCard' => [
            'number' => '4111111111111111',
            'expiry' => '12/25',
            'cvv' => '123'
        ]
    ]
]);
?> 