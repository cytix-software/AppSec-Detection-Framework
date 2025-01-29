<?php
// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $val = $_POST['val']; // Get user input without encoding

    try {
        $value = (int) $val; // Attempt to parse as integer
    } catch (Exception $e) {
        // CWE-117: Log Injection (Improper Output Neutralization for Logs)
        $logEntry = "ERROR: Failed to parse val = $val\n"; // Vulnerable log entry
        file_put_contents("app.log", $logEntry, FILE_APPEND); // Logging without sanitization
    }
    
    // CWE-644: HTTP Header Injection (Response Splitting)
    header("X-Custom-Header: $val"); // Vulnerable header output
    
    // CWE-116: XSS Vulnerability
    echo "<p>Value entered: $val</p>"; // Reflecting user input without escaping
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
