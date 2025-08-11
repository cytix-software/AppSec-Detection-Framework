<?php
// Simulate config file with base64-encoded password
$ini = "password = \"" . base64_encode('password123') . "\"\n";
file_put_contents(__DIR__ . '/config.properties', $ini);

// Simulates connecting to a database.
function db_connect($user, $pass) {
    echo "Attempting to connect with user '{$user}' and password '{$pass}'...<br>";
    if ($user === 'admin' && $pass === 'password123') {
        echo "<strong>Connection Successful!</strong><br>";
        return true;
    } else {
        echo "<strong>Connection Failed.</strong><br>";
        return false;
    }
}

// Read config file
$config = parse_ini_file(__DIR__ . '/config.properties');
$encoded_password = isset($config['password']) ? $config['password'] : '';

// Decode the password. This is easily reversible.
$decoded_password = base64_decode($encoded_password);

echo "Encoded password from config: " . htmlspecialchars($encoded_password) . "<br>";
echo "Decoded password: " . htmlspecialchars($decoded_password) . "<br><hr>";

// 3. Use the decoded password to "connect" to the database.
db_connect('admin', $decoded_password);

?>