<?php
// This script demonstrates a filter that blocks 'script' to prevent XSS attacks.

function preventXSS($input, $mask) {
    return str_replace("script", $mask, $input);
}
// takes user input and filters it to block 'script' to prevent XSS
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $userInput = $_POST['input'] ?? '';
    $filteredInput = preventXSS($userInput, "BLOCKED");
    echo $filteredInput;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test 65</title>
</head>
<body>
    <h1>Test 65</h1>
    <form action="" method="post">
        <input type="text" name="input" id="input" placeholder="Try: SCRIPT, Script, or script">
        <input type="submit" value="Submit">
    </form>
</body>
</html>