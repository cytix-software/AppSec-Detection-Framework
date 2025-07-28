<?php
// CWE-497: Exposure of System Data to an Unauthorized Control Sphere
// This script demonstrates exposure of system process information to unauthorized users.

// Simulate getting the current user 
function getCurrentUser() {
    return 'www-data'; // Example username
}

$userName = getCurrentUser();
$command = 'ps aux | grep ' . $userName;

// VULNERABLE: Exposes system process information to the web user
$output = shell_exec($command);
?>
<!DOCTYPE html>
<html>
<head>
    <title>CWE-497: System Data Exposure</title>
</head>
<body>
    <h1>CWE-497: System Data Exposure</h1>
    <h2>System Process Information for User '<?php echo htmlspecialchars($userName); ?>'</h2>
    <pre><?php echo htmlspecialchars($output); ?></pre>
    <p style="color:orange;">Note: This page exposes sensitive system process information to any user who can access it.</p>
</body>
</html> 