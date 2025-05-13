<?php
// Vulnerable to CWE-942: Permissive Cross-domain Policy with Untrusted Domains
// This application sets a permissive CORS policy that allows any domain to access its resources

// Set permissive CORS headers
header("Access-Control-Allow-Origin: *");  // Allows any domain to access
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

// Sample sensitive data that could be accessed by any domain
$sensitiveData = [
    'user_id' => '12345',
    'email' => 'user@example.com',
    'role' => 'admin'
];

// Return the sensitive data as JSON
header('Content-Type: application/json');
echo json_encode($sensitiveData);
?> 