<?php
// Generate a session ID
function generateSessionId() {
    return bin2hex(random_bytes(16)); // A random 16-byte session ID
}

// Set the session cookie
$sessionId = generateSessionId();
setcookie("session_id", $sessionId, time() + 3600, "/"); // Cookie is valid for 1 hour

echo "Cookie set. Your session ID is: " . htmlspecialchars($sessionId);
?>
