<?php
// Keys for encryption and MAC
$enc_key = random_bytes(32);
$mac_key = random_bytes(32);
$plaintext = "This is a sensitive message";
$iv = random_bytes(12);

// Sender encrypts the message
$tag = '';
$ciphertext = openssl_encrypt($plaintext, 'aes-256-gcm', $enc_key, OPENSSL_RAW_DATA, $iv, $tag);

// Sender computes MAC over ciphertext
$mac = hash_hmac('sha256', $ciphertext, $mac_key);

// Simulate receiver decrypting the message
$decrypted = openssl_decrypt($ciphertext, 'aes-256-gcm', $enc_key, OPENSSL_RAW_DATA, $iv, $tag);

echo "<h1>Test 84</h1>\n";
echo "<p><strong>Decrypted message:</strong> " . htmlspecialchars($decrypted) . "</p>\n";

?>
