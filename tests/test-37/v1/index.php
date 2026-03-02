<?php
session_start();

// Hardcoded server secret used to issue auth cookie
$serverSecret = "super-secret-key";

// Valid request window (seconds)
$validWindow = 60;

// Issue cookie if not present (simulated login)
if (!isset($_COOKIE['auth_token'])) {
    $token = hash_hmac("sha256", "user-session", $serverSecret);
    setcookie("auth_token", $token, time() + 300, "/", "", false, true);
    echo "<p>Auth cookie issued. Refresh page.</p>";
    exit;
}

// Verify cookie authenticity
function verify_cookie($cookie, $secret) {
    $expected = hash_hmac("sha256", "user-session", $secret);
    return hash_equals($expected, $cookie);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $message = $_POST["message"] ?? "";
    $timestamp = $_POST["ts"] ?? "";

    // Check cookie
    if (!verify_cookie($_COOKIE['auth_token'], $serverSecret)) {
        http_response_code(401);
        echo "Invalid authentication token.";
        exit;
    }

    // Validate timestamp
    if (!is_numeric($timestamp)) {
        http_response_code(400);
        echo "Invalid timestamp.";
        exit;
    }

    // If all checks pass
    echo "<h3>Message accepted:</h3>";
    echo "<p>" . htmlspecialchars($message) . "</p>";
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Secure Echo</title>
</head>
<body>
    <h1>Secure Echo (Cookie + Timestamp)</h1>

    <form method="POST">
        <label>Message:</label><br>
        <input type="text" name="message" required><br><br>

        <!-- Current timestamp -->
        <input type="hidden" name="ts" value="<?php echo time(); ?>">

        <button type="submit">Send</button>
    </form>

    <p>Requests expire after <?php echo $validWindow; ?> seconds.</p>
</body>
</html>