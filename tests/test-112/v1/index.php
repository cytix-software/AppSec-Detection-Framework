<?php

$customer = [
    'name' => 'Jane Doe',
    'email' => 'jane.doe@example.com',
    'address' => '123 Main St, London',
    'phone' => '+44 1234 567890',
    'dob' => '1990-01-01',
    'credit_card' => '4111 1111 1111 1111',
];

echo "<h1>Test 112</h1>";
echo "<h2>Show customer information</h2>";
echo "<ul>";
foreach ($customer as $key => $value) {
    echo "<li><strong>" . htmlspecialchars($key) . ":</strong> " . htmlspecialchars($value) . "</li>";
}
echo "</ul>";
?>
