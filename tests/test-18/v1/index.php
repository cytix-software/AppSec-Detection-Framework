<?php
// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = $_POST['email']; // Get user input without encoding

    // CWE-644: HTTP Header Injection (Response Splitting)
    header("X-Custom-Header: $email"); // Vulnerable header output
} else {
    $email = "";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CWE-644 & CWE-116 Vulnerability Demo</title>
</head>
<body>
    <h2>Enter Your Email</h2>
    <form method="POST" action="">
        <label for="email">Email:</label>
        <input type="text" id="email" name="email" required>
        <button type="submit">Submit</button>
    </form>

    <?php if (!empty($email)) : ?>
        <p>Email Address: <?php echo $email; ?></p> <!-- CWE-116: Vulnerable output (XSS) -->
    <?php endif; ?>
</body>
</html>
