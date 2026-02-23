<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $message = $_POST['message'];
    $signature = $_POST['signature'];

    // Signature expected
    if ($signature !== "SIGNATURE") {
        echo "<h2>Invalid Signature</h2>";
    }

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
        <label>Message:</label>
        <input type="text" name="message" required><br>
        <label>Signature:</label>
        <input type="text" name="signature" value="SIGNATURE"><br>
        <button type="submit">Send</button>
    </form>
</body>
</html>