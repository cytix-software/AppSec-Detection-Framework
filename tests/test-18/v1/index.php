<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $val = $_POST['val']; 
    try {
        if (!is_numeric($val)) {
            throw new Exception("Invalid number");
        }
        $value = (int) $val; 
    } catch (Exception $e) {
        // CWE-117: Log Injection 
        $decoded = urldecode($val);
        $logEntry = "INFO: Failed to parse val = $decoded\n"; 
        file_put_contents("app.log", $logEntry, FILE_APPEND); 
    }
    
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
    <title>CWE-644, CWE-116 & CWE-117 Vulnerability Demo</title>
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
