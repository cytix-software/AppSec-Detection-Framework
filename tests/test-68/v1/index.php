<?php
// CWE-97: Improper Neutralization of Server-Side Includes (SSI) Directives in Web Pages
// This script demonstrates SSI injection by writing user input to an .shtml file.

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_input = $_POST['message'] ?? '';
    $filename = 'user_message.shtml';
    
    // VULNERABLE: User input is written to an .shtml file without sanitization
    // The .shtml file will be processed by the web server with SSI enabled
    $content = "<html><body><h1>User Message</h1><p>$user_input</p></body></html>";
    file_put_contents($filename, $content);
    
    echo "Message saved to $filename<br>";
    echo "<a href='$filename'>View Message</a>";
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>CWE-97: SSI Injection</title>
</head>
<body>
    <h1>CWE-97: SSI Injection</h1>
    <form method="post">
        <label>Enter your message:</label><br>
        <textarea name="message" rows="4" cols="50" required></textarea><br>
        <button type="submit">Save Message</button>
    </form>
</body>
</html> 