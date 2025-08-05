<?php
// CWE-87: Improper Neutralization of Alternate XSS Syntax
// CWE-184: Incomplete List of Disallowed Inputs
// This script demonstrates a filter that only blocks 'script' but allows variants, an incomplete list of disallowed inputs.

function preventXSS($input, $mask) {
    // VULNERABLE: Only blocks lowercase 'script', allowing variants such as 'SCRIPT' or 'Script'
    return str_replace("script", $mask, $input);
}
// takes user input and filters it to block 'script' to prevent XSS
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $userInput = $_POST['input'] ?? '';
    // Apply the vulnerable filter
    $filteredInput = preventXSS($userInput, "BLOCKED");
    echo $filteredInput;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>CWE-87: Improper Neutralization of Alternate XSS Syntax</title>
</head>
<body>
    <h1>CWE-87: Improper Neutralization of Alternate XSS Syntax</h1>
    <form action="" method="post">
        <input type="text" name="input" id="input" placeholder="Try: SCRIPT, Script, or script">
        <input type="submit" value="Submit">
    </form>
    <p style="color:orange;">Note: The filter only blocks 'script' but allows variants like 'SCRIPT' or 'Script'.</p>
</body>
</html> 