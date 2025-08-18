<?php
// Allows any input containing 'ls', 'ping', 'cat', or 'whoami' to be executed

$allowed_commans = ['ls', 'ping', 'cat', 'whoami'];
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $cmd = $_POST['cmd'] ?? '';
    $allowed = false;

    // check if allowed commands contains the input command
    foreach ($allowed_commans as $command) {
        if (stripos($cmd, $command) !== false) {
            $allowed = true;
            break;
        }
    }
    if ($allowed) {
        // execute command if it contains allowed commands
        $output = shell_exec($cmd);
        $message = "<pre>" . htmlspecialchars($output) . "</pre>";
    } else {
        $message = "<span style='color:red;'>Command not allowed.</span>";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test-95</title>
</head>
<body>
    <h1>Test-95</h1>
    <form method="post">
        <label for="cmd">Enter command (only ls, ping, cat, or whoami is allowed):</label>
        <input type="text" id="cmd" name="cmd" placeholder="e.g. ls -la /, ping 8.8.8.8">
        <button type="submit">Execute</button>
    </form>
    <?= $message ?>
</body>
</html>
</html>