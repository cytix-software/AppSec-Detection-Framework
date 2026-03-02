<?php
$password = '';
$password_hash = '';
$selected_algorithm = '';
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'] ?? '';
    $supported = $_POST['supported_algs'] ?? []; // array of strings

    // Negotiation for selected hashing algorithm
    if (in_array('md5', $supported, true)) {
        $selected_algorithm = 'md5';
        $password_hash = hash('md5', $password);
        $message = 'Negotiated algorithm: md5';
    } elseif (in_array('sha-1', $supported, true) || in_array('sha1', $supported, true)) {
        $selected_algorithm = 'sha-1';
        $password_hash = hash('sha1', $password);
        $message = 'Negotiated algorithm: sha-1';
    } elseif (in_array('sha256', $supported, true)) {
        $selected_algorithm = 'sha256';
        $password_hash = hash('sha256', $password);
        $message = 'Negotiated algorithm: sha256';
    } else {
        $message = 'No mutually supported algorithm.';
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test 91</title>
</head>
<body>
    <h1>Test 91</h1>

    <form method="post">
        <label for="password">Password to hash:</label><br>
        <input type="text" id="password" name="password"
               value="<?= htmlspecialchars($password) ?>" required>

        <!-- Hidden static supported algorithm list -->
        <input type="hidden" name="supported_algs[]" value="md5">
        <input type="hidden" name="supported_algs[]" value="sha-1">
        <input type="hidden" name="supported_algs[]" value="sha256">

        <br><br>
        <button type="submit">Submit</button>
    </form>

    <?php if ($message): ?>
        <div style="margin-top:15px; padding:10px; border:1px solid #ccc;">
            <strong><?= htmlspecialchars($message) ?></strong><br>
            <?php if ($selected_algorithm): ?>
                <div>Selected: <?= htmlspecialchars($selected_algorithm) ?></div>
                <div>Hash: <?= htmlspecialchars($password_hash) ?></div>
            <?php endif; ?>
        </div>
    <?php endif; ?>
</body>
</html>