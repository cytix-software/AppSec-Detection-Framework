<?php
$key   = hex2bin('00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff'); // 32 bytes
$nonce = str_repeat("A", 12); // 12-byte nonce

function enc($plaintext, $key, $nonce, &$tag) {
    return openssl_encrypt($plaintext, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $nonce, $tag);
}

$pt1 = $_POST['m1'] ?? 'Secret message 1';
$pt2 = $_POST['m2'] ?? 'Secret message 2';

$ct1 = enc($pt1, $key, $nonce, $tag1);
$ct2 = enc($pt2, $key, $nonce, $tag2);
?>
<!doctype html>
<html>
<body>
<h1>Test 82</h1>
<form method="post">
  <input name="m1" value="<?= htmlspecialchars($pt1) ?>" style="width:400px"><br>
  <input name="m2" value="<?= htmlspecialchars($pt2) ?>" style="width:400px"><br>
  <button type="submit">Encrypt both</button>
</form>

<p><b>Nonce (base64):</b> <?= base64_encode($nonce) ?></p>
<p><b>Ciphertext1 (base64):</b> <?= base64_encode($ct1) ?></p>
<p><b>Tag1 (base64):</b> <?= base64_encode($tag1) ?></p>
<p><b>Ciphertext2 (base64):</b> <?= base64_encode($ct2) ?></p>
<p><b>Tag2 (base64):</b> <?= base64_encode($tag2) ?></p>
</body>
</html>