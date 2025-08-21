<?php
session_start();

// Simulated user authentication 
$validToken = "123456";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $token = $_POST["auth_token"] ?? "";

    if ($token === $validToken) {
        $_SESSION["authenticated"] = true;
        echo "Authentication successful! You are logged in.";
    } else {
        echo "Authentication failed!";
    }
} else {
?>
    <form method="POST">
        <input type="hidden" name="auth_token" value="123456">
        <button type="submit">Login</button>
    </form>
<?php
}
?>
