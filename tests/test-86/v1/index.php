<?php
// Using mt_rand() to generate a cryptographic key
$key = '';
for ($i = 0; $i < 16; $i++) { // 128-bit key
    $key .= chr(mt_rand(0, 255));
}
// encrypts the message with aes using the key
$plaintext = "Sensitive message";
$iv = random_bytes(16);
$ciphertext = openssl_encrypt($plaintext, 'aes-128-cbc', $key, 0, $iv);

echo "<h2>Test 86</h2>\n";
echo "<p><strong>Plaintext:</strong> " . htmlspecialchars($plaintext) . "</p>\n";
echo "<p><strong>Ciphertext (base64):</strong> " . htmlspecialchars($ciphertext) . "</p>\n";
?>