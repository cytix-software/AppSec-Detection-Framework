<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $val = $_POST['val']; 
    
    // CWE-644: HTTP Header Injection 
    header("X-Custom-Header: $val"); 
    
    // CWE-116: XSS Vulnerability
    echo "<p>Value entered: $val</p>";
} else {
    $val = "";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test 18</title>
</head>
<body>
    <h2>Enter a Value</h2>
    <form method="POST" action="">
        <label for="val">Value:</label>
        <input type="text" id="val" name="val" required>
        <button type="submit">Submit</button>
    </form>
</body>
</html>
