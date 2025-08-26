<?php

// key and nonce for AES-256 encryption
$key = random_bytes(32);
$nonce = str_repeat("A", 12);

$plaintext1 = "Secret message 1";
$plaintext2 = "Secret message 2";

// Encrypt both messages with the same key and nonce
$ciphertext1 = openssl_encrypt($plaintext1, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $nonce, $tag1);
$ciphertext2 = openssl_encrypt($plaintext2, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $nonce, $tag2);

echo "<h1>Test 82</h1>";
echo "<p><strong>Key (base64):</strong> " . base64_encode($key) . "</p>";
echo "<p><strong>Nonce (base64):</strong> " . base64_encode($nonce) . "</p>";
echo "<p><strong>Plaintext 1:</strong> $plaintext1</p>";
echo "<p><strong>Plaintext 2:</strong> $plaintext2</p>";
echo "<p><strong>Ciphertext 1 (base64):</strong> " . base64_encode($ciphertext1) . "</p>";
echo "<p><strong>Ciphertext 2 (base64):</strong> " . base64_encode($ciphertext2) . "</p>";
?>