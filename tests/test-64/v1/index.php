<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $filename = $_POST['filename'] ?? '';
    // User input is used directly as a command argument
    $output = shell_exec("ls -l " . $filename);
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Directory Lister</title>
</head>
<body>
    <h1>Directory Lister</h1>
    <form method="post">
        <label for="filename">Enter a filename or directory to list:</label>
        <input type="text" id="filename" name="filename">
        <button type="submit">List</button>
    </form>
    <?php if (isset($output)): ?>
        <pre><?php echo htmlspecialchars($output); ?></pre>
    <?php endif; ?>
    <p style="color:orange;">Note: User input is passed directly as a command argument.</p>
</body>
</html>