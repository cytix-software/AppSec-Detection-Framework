<?php
// CWE-547: Use of Hard-coded, Security-relevant Constants
// This script demonstrates the use of a hard-coded encryption key as a literal value.
// also CWE 321: Use of Hard-coded Cryptographic Key,
// CWE 798: Use of Hard-coded Credentials, and
// CWE-329: Not Using a Random IV with CBC Mode.

function encrypt($data) {
    // VULNERABLE: Uses a hard-coded key and a fixed IV
    $iv = "1234567890123456"; // Fixed IV CWE-329
    $encrypted = openssl_encrypt($data, 'AES-128-CBC', 'mySuperSecretKey123', 0, $iv);
    return base64_encode($iv . $encrypted);
}

function decrypt($data) {
    $data = base64_decode($data);
    $iv = substr($data, 0, 16);
    $encrypted = substr($data, 16);
    return openssl_decrypt($encrypted, 'AES-128-CBC', 'mySuperSecretKey123', 0, $iv);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $plaintext = $_POST['secret'] ?? '';
    $ciphertext = encrypt($plaintext);
    $decrypted = decrypt($ciphertext);
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>CWE-547, CWE-329, CWE-321, CWE-798</title>
</head>
<body>
    <h1>CWE-547, CWE-329, CWE-321, CWE-798</h1>
    <form method="post">
        <label for="secret">Enter text to encrypt:</label>
        <input type="text" id="secret" name="secret" required>
        <button type="submit">Encrypt</button>
    </form>
    <?php if (isset($ciphertext)): ?>
        <p><strong>Encrypted:</strong> <?php echo htmlspecialchars($ciphertext); ?></p>
        <p><strong>Decrypted:</strong> <?php echo htmlspecialchars($decrypted); ?></p>
        <p style="color:orange;">Note: The encryption key is hard-coded and the IV is fixed, which is insecure.</p>
    <?php endif; ?>
</body>
</html> 