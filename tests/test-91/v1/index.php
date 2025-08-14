<?php

$password = 'password';
$password_hash = '';
$selected_algorithm = '';
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $algorithm = $_POST['algorithm'] ?? '';
    $selected_algorithm = $algorithm;
    if ($algorithm == 'md5') {
        $password_hash = hash('md5', $password);
        $message = 'Password has been hashed using md5 (VULNERABLE)';
    }
    elseif ($algorithm == 'sha-1') {
        $password_hash = hash('sha1', $password);
        $message = 'Password has been hashed using sha-1 (VULNERABLE)';
    }
    elseif ($algorithm == 'sha256') {
       $password_hash = hash('sha256', $password);
       $message = 'Password has been hashed using sha256 (SECURE)';
    }
    else {
        $message = 'Invalid hash algorithm';
    }
}


?>
<!DOCTYPE html>
<html>
<head>
    <title>CWE-757</title>
</head>
<body>
    <h1>CWE-757</h1>
    <form method="post">
        <label for="algorithm">Select a hashing algorithm to use for password storage</label><br>
        <input type="text" id="algorithm" name="algorithm" placeholder="md5, sha-1, or sha256" value="<?= htmlspecialchars($selected_algorithm) ?>">
        <button type="submit">Select</button>
    </form>
    <?php if ($message): ?>
        <div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">
            <?= $message ?><br>
            <?= htmlspecialchars($password_hash) ?>
        </div>
    <?php endif; ?>
</body>
</html> 