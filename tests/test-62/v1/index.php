<?php
// This script displays system process information for the current user.

// Simulate getting the current user 
function getCurrentUser() {
    return 'www-data'; // Example username
}

$userName = getCurrentUser();
$command = 'ps aux | grep ' . $userName;

$output = shell_exec($command);
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test 62</title>
</head>
<body>
    <h1>Test 62</h1>
    <h2>System Process Information for User '<?php echo htmlspecialchars($userName); ?>'</h2>
    <pre><?php echo htmlspecialchars($output); ?></pre>
</body>
</html>