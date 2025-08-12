<?php
// CWE-326: Inadequate Encryption Strength (old and vulnerable encryption algorithm - DES)

$key = "secretk"; // 8 bytes for DES
$plaintext = "Sensitive data";

// VULNERABLE: DES is considered insecure due to its short key length (56 bits)
$ciphertext = openssl_encrypt($plaintext, 'des-ecb', $key);

echo "<h2>CWE-326: Inadequate Encryption Strength (DES example)</h2>\n";
echo "<p><strong>Plaintext:</strong> " . htmlspecialchars($plaintext) . "</p>\n";
echo "<p><strong>Encrypted with DES (base64):</strong> " . htmlspecialchars($ciphertext) . "</p>\n";
echo "<p style='color:red'><strong>Vulnerability:</strong> DES is outdated and can be easily brute forced.</p>\n";
?>