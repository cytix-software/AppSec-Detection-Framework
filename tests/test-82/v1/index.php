<?php
// CWE-323: Reusing a Nonce, Key Pair in Encryption

$key = random_bytes(32); // 256-bit key
$nonce = str_repeat("A", 12); // BAD: Fixed nonce reused for every encryption

$plaintext1 = "Secret message 1";
$plaintext2 = "Secret message 2";

// Encrypt both messages with the same key and nonce
$ciphertext1 = openssl_encrypt($plaintext1, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $nonce, $tag1);
$ciphertext2 = openssl_encrypt($plaintext2, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $nonce, $tag2);

echo "<h2>CWE-323: Reusing a Nonce, Key Pair in Encryption</h2>";
echo "<p><strong>Key (base64):</strong> " . base64_encode($key) . "</p>";
echo "<p><strong>Nonce (base64):</strong> " . base64_encode($nonce) . " <span style='color:red'>(REUSED)</span></p>";
echo "<p><strong>Plaintext 1:</strong> $plaintext1</p>";
echo "<p><strong>Plaintext 2:</strong> $plaintext2</p>";
echo "<p><strong>Ciphertext 1 (base64):</strong> " . base64_encode($ciphertext1) . "</p>";
echo "<p><strong>Ciphertext 2 (base64):</strong> " . base64_encode($ciphertext2) . "</p>";
echo "<p style='color:red'>Both messages were encrypted with the same key and nonce. This is a critical cryptographic flaw!</p>";
?>