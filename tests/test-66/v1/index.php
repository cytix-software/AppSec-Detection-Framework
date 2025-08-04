<?php
// CWE-94: Improper Control of Generation of Code ('Code Injection') & CWE 79: Cross-site Scripting
// This script demonstrates code injection via file inclusion based on user input.

$MessageFile = "messages.out";
if (isset($_GET["action"]) && $_GET["action"] == "NewMessage") {
    $name = $_GET["name"] ?? '';
    $message = $_GET["message"] ?? '';
    $handle = fopen($MessageFile, "a+");
    // writes user input to file
    fwrite($handle, "<b>$name</b> says '$message'<hr>\n");
    fclose($handle);
    echo "Message Saved!<p>\n";
} else if (isset($_GET["action"]) && $_GET["action"] == "ViewMessages") {
    // user messages are parsed and executed - vulnerable to code injection and also XSS
    include($MessageFile);
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>CWE-94: Code Injection</title>
</head>
<body>
    <h1>CWE-94: Code Injection</h1>
    <form method="get">
        <input type="hidden" name="action" value="NewMessage">
        Name: <input type="text" name="name" required><br>
        Message: <input type="text" name="message" required><br>
        <button type="submit">Submit Message</button>
    </form>
    <form method="get">
        <input type="hidden" name="action" value="ViewMessages">
        <button type="submit">View Messages</button>
    </form>
</body>
</html> 