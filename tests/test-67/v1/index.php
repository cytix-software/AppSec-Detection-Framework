<?php
// This application evaluates user input.

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = $_POST['code'] ?? '';
    echo "<b>Input:</b> " . htmlspecialchars($input) . "<br>";
    eval($input);
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Code Injection (eval)</title>
</head>
<body>
    <h1>Code Injection (eval)</h1>
    <form method="post">
        <label>Enter PHP code to evaluate (e.g., system('id');):</label><br>
        <input type="text" name="code" style="width:400px" required><br>
        <button type="submit">Run Code</button>
    </form>
</body>
</html>