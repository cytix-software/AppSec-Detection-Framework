<?php
$key = "secretk"; // 8 bytes for DES
$plaintext = "Sensitive data";

// encrypts the plaintext using DES in ECB mode
$ciphertext = openssl_encrypt($plaintext, 'des-ecb', $key);

echo "<h1>Test 85</h1>\n";
echo "<p><strong>Plaintext:</strong> " . htmlspecialchars($plaintext) . "</p>\n";
echo "<p><strong>Encrypted with DES (base64):</strong> " . htmlspecialchars($ciphertext) . "</p>\n";
?>