<?php
// CWE-325: Missing Cryptographic Step

// Keys for encryption and MAC
$enc_key = random_bytes(32); // 256-bit key for encryption
$mac_key = random_bytes(32); // 256-bit key for HMAC
$plaintext = "This is a sensitive message";
$iv = random_bytes(12); // 12 bytes for AES-GCM

// Sender encrypts the message
$tag = '';
$ciphertext = openssl_encrypt($plaintext, 'aes-256-gcm', $enc_key, OPENSSL_RAW_DATA, $iv, $tag);

// Sender computes MAC over ciphertext
$mac = hash_hmac('sha256', $ciphertext, $mac_key);

// Simulate sending $ciphertext, $iv, $tag, and $mac to the receiver
// VULNERABLE: Receiver only decrypts, does NOT check the MAC, which could
$decrypted = openssl_decrypt($ciphertext, 'aes-256-gcm', $enc_key, OPENSSL_RAW_DATA, $iv, $tag);

echo "<h2>CWE-325: Missing Cryptographic Step</h2>\n";
echo "<p><strong>Decrypted message (without MAC verification):</strong> " . htmlspecialchars($decrypted) . "</p>\n";
echo "<p style='color:red'><strong>Vulnerability:</strong> The receiver decrypts the message but does not verify the MAC. The integrity and authenticity of the message has not been verified.</p>\n";

// In a secure implementation, the receiver would check:
// if (hash_equals($mac, hash_hmac('sha256', $ciphertext, $mac_key))) { ... }
?>
