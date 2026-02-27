<?php
session_start();

/*
  POLICY INTENT:
  - Only logged-in users should see customer data.
*/

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");

$customer = [
  'name' => 'Jane Doe',
  'email' => 'jane.doe@example.com',
  'address' => '123 Main St, London',
  'phone' => '+44 1234 567890',
  'dob' => '1990-01-01',
  'credit_card' => '4111 1111 1111 1111',
];

// Login simulation
if (isset($_POST['login'])) {
  $_SESSION['user'] = 'jane';
  header("Location: /");
  exit;
}

echo "<h1>Test 112</h1>";

if (!isset($_SESSION['user'])) {
  echo "<form method='post'>
          <button name='login' value='1'>Login as Jane</button>
        </form>";
  echo "<p>You are not logged in.</p>";
  exit;
}

echo "<h2>Customer Information</h2><ul>";
foreach ($customer as $k => $v) {
  echo "<li><strong>" . htmlspecialchars($k) . ":</strong> " . htmlspecialchars($v) . "</li>";
}
echo "</ul>";