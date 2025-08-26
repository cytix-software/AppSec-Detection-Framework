<?php
// This application takes a user inputted messaage and writes it to a file, which can then be viewed later.

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
    // user messages are parsed 
    include($MessageFile);
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Code Injection Demonstration</title>
</head>
<body>
    <h1>Code Injection Demonstration</h1>
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