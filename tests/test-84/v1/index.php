<?php
// Keys for encryption and MAC
$enc_key = random_bytes(32); // AES-256 key
$mac_key = random_bytes(32); // HMAC key

$plaintext = "This is a sensitive message";
$iv = random_bytes(16); // CBC needs a 16-byte IV

// Sender encrypts the message
$ciphertext = openssl_encrypt(
    $plaintext,
    'aes-256-cbc',
    $enc_key,
    OPENSSL_RAW_DATA,
    $iv
);

// Sender computes MAC over (iv || ciphertext)
$mac = hash_hmac('sha256', $iv . $ciphertext, $mac_key);

// --- Simulated receiver side ---
$decrypted = openssl_decrypt(
    $ciphertext,
    'aes-256-cbc',
    $enc_key,
    OPENSSL_RAW_DATA,
    $iv
);

echo "<h1>Test 84</h1>\n";
echo "<p><strong>Decrypted message:</strong> " . htmlspecialchars((string)$decrypted) . "</p>\n";
?>