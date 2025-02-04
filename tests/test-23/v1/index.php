//cwe-384+ 

<?php
session_start(); // Start or resume the session

// Simulating an attacker setting a fixed session ID
if (isset($_GET['fixation'])) {
    session_id($_GET['fixation']); // Attacker forces a known session ID
    session_start(); // Restart session with fixed ID
    echo "Session fixation set. Session ID: " . session_id() . "<br>";
}

// Simulated user login
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $_SESSION['user'] = $_POST['username']; // User logs in, but session ID is not regenerated
    echo "User " . htmlspecialchars($_POST['username']) . " is now logged in!<br>";
    echo "Session ID: " . session_id() . "<br>";
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Session Fixation Demo</title>
</head>
<body>
    <h2>Session Fixation Vulnerability Demo</h2>

    <p>Current Session ID: <?php echo session_id(); ?></p>

    <form method="POST">
        <label for="username">Username:</label>
        <input type="text" name="username" required>
        <button type="submit">Login</button>
    </form>

    <p><strong>Attacker Scenario:</strong> An attacker can visit <code>?fixation=knownSessionID</code> to fix the session ID before the victim logs in.</p>
</body>
</html>
