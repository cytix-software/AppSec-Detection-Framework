<?php
$name = $_POST['name'] ?? '';
$message = $_POST['message'] ?? '';
$publicKeyString = '-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqIoGskIMwc03mqspf1mu
V3FZvjlVm432ryA3PCHC17Xjw/YiLdWbLVv/5WmbFsQrdRpUBHzKalWy6tQV8kla
DzMKPMKtrG+Kse2pMAfb6ZZmHPl1jyA/tDdWSGoNdQ2PxGQIKbP0cELvsDF9UbzY
jzT+KKJn8WeqRI9cb+QSYyGAIbqYRBCFawnCdJi1WHUz0xX6I2OApphhv68H5TNK
j32QbpWJeF5awWUxQxlBJERxdS/+XnblELtYjCWRtSUsn8wNnRRLH7ByV1+dutiw
16+IAlxIzEwoRPellawtu+Mk6UAUHbyiA1GqZsrhl7e0ZdOlHbq3b3tL8He0+/Y3
LQIDAQAB
-----END PUBLIC KEY-----';

$publicKey = openssl_pkey_get_public($publicKeyString);

// is message submitted, encrypt it
if (isset($_POST['message']) && !empty($message)) {
    $encryptedMessage = '';
    if (!openssl_public_encrypt($message, $encryptedMessage, $publicKey)) {
        echo "<p style='color:red'>Error encrypting message: " . openssl_error_string() . "</p>";
        $encryptedMessage = '';
    }
} else {
    $encryptedMessage = '';
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test 92</title>
</head>
<body>
    <h1>Test 92</h1>
    <form action="" method="post">
        <label for="name">Name:</label><br>
        <input type="text" id="name" name="name"><br>
        <label for="message">Message:</label><br>
        <input type="text" id="message" name="message"><br><br>
        <input type="submit" value="Submit">
    </form>
    <?php if ($encryptedMessage): ?>
        <div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">
            <p style="color: green;">Message encrypted successfully!</p>
        </div>
    <?php endif; ?>
</body>
</html>