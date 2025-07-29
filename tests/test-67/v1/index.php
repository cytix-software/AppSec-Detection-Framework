<?php
// CWE-95: Improper Neutralization of Directives in Dynamically Evaluated Code ('Eval Injection')
// This script demonstrates code injection via eval() on direct user input.

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = $_POST['code'] ?? '';
    echo "<b>Input:</b> " . htmlspecialchars($input) . "<br>";
    // VULNERABLE: User input is evaluated as PHP code which can be used to inject code
    eval($input);
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>CWE-94: Code Injection (eval)</title>
</head>
<body>
    <h1>CWE-94: Code Injection (eval)</h1>
    <form method="post">
        <label>Enter PHP code to evaluate (e.g., system('id');):</label><br>
        <input type="text" name="code" style="width:400px" required><br>
        <button type="submit">Run Code</button>
    </form>
</body>
</html> 