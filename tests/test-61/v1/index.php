<?php
// This script demonstrates encryption and decryption of data using OpenSSL

function encrypt($data) {
    $iv = "1234567890123456";
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
    <title>Test 61</title>
</head>
<body>
    <h1>Encryption and Decryption Demo</h1>
    <form method="post">
        <label for="secret">Enter text to encrypt:</label>
        <input type="text" id="secret" name="secret" required>
        <button type="submit">Encrypt</button>
    </form>
    <?php if (isset($ciphertext)): ?>
        <p><strong>Encrypted:</strong> <?php echo htmlspecialchars($ciphertext); ?></p>
        <p><strong>Decrypted:</strong> <?php echo htmlspecialchars($decrypted); ?></p>
    <?php endif; ?>
</body>
</html>