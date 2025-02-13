<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $message = $_POST['message'];
    
    // Simulating a transmission without integrity checks
    echo "<h2>Received Message:</h2>";
    echo "<p>" . htmlspecialchars($message) . "</p>";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Test 27</title>
</head>
<body>
    <h1>Send a Message</h1>
    <form method="post">
        <label for="message">Enter your message:</label>
        <input type="text" name="message" id="message" required>
        <button type="submit">Send</button>
    </form>
</body>
</html>
