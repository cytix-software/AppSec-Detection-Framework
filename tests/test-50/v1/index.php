<?php

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
header("Access-Control-Allow-Origin: $origin"); //reflect origin
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Vary: Origin");

// Sample sensitive data
$sensitiveData = [
    'user_id' => '12345',
    'email' => 'user@example.com',
    'role' => 'admin'
];

// Return the sensitive data as JSON
header('Content-Type: application/json');
echo json_encode($sensitiveData);
?> 