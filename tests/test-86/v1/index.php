<?php
// CWE-338: Use of Cryptographically Weak Pseudo-Random Number Generator (PRNG)

// VULNERABLE: Using mt_rand() to generate a cryptographic key
$key = '';
for ($i = 0; $i < 16; $i++) { // 128-bit key
    $key .= chr(mt_rand(0, 255));
}
$plaintext = "Sensitive message";
$iv = random_bytes(16); // IV should be random, but key is weak
$ciphertext = openssl_encrypt($plaintext, 'aes-128-cbc', $key, 0, $iv);

echo "<h2>CWE-338: Use of Cryptographically Weak Pseudo-Random Number Generator (PRNG)</h2>\n";
echo "<p><strong>Plaintext:</strong> " . htmlspecialchars($plaintext) . "</p>\n";
echo "<p><strong>Ciphertext (base64):</strong> " . htmlspecialchars($ciphertext) . "</p>\n";
echo "<p style='color:red'><strong>Vulnerability:</strong> The encryption key is generated using mt_rand(), which is not cryptographically secure and may be predictable, which can allow attackers to recover the plaintext.</p>\n";
?>