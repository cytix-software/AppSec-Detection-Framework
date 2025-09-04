<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $val = $_POST['val']; 
    try {
        if (!is_numeric($val)) {
            throw new Exception("Invalid number");
        }
        $value = (int) $val; 
    } catch (Exception $e) {
        $decoded = urldecode($val);
        $logEntry = "INFO: Failed to parse val = $decoded\n"; 
        file_put_contents("app.log", $logEntry, FILE_APPEND); 
    }
} else {
    $val = "";
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Test 21</title>
</head>
<body>
    <h1>Test 21</h1>
    <h2>Enter a Value</h2>
    <form method="POST" action="">
        <label for="val">Value:</label>
        <input type="text" id="val" name="val" required>
        <button type="submit">Submit</button>
    </form>
</body>
</html>


