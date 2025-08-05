<?php
// CWE-88: Argument Injection or Modification
// also CWE-138: Improper Neutralization of Special Elements 
// This script demonstrates both CWE's by passing user input as an argument to a system command and not delimiting the arguments
// A payload such as '< /etc/passwd' will be executed as 'ls -l < /etc/passwd', exposing sensitive information

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $filename = $_POST['filename'] ?? '';
    // VULNERABLE: User input is used directly as a command argument
    $output = shell_exec("ls -l " . $filename);
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>CWE-88: Argument Injection</title>
</head>
<body>
    <h1>CWE-88: Argument Injection or Modification</h1>
    <form method="post">
        <label for="filename">Enter a filename or directory to list:</label>
        <input type="text" id="filename" name="filename">
        <button type="submit">List</button>
    </form>
    <?php if (isset($output)): ?>
        <pre><?php echo htmlspecialchars($output); ?></pre>
    <?php endif; ?>
    <p style="color:orange;">Note: User input is passed directly as a command argument, which is vulnerable to argument injection.</p>
</body>
</html> 