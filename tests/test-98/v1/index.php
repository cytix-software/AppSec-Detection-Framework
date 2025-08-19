<?php
// Load config.json into memory as an associative array
$config = json_decode(file_get_contents('config.json'), true);

// Load data from config file into variables
$db_password = $config['database_password'] ?? '';
$api_key = $config['api_key'] ?? '';
$smtp_password = $config['smtp_password'] ?? '';
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test-98</title>
</head>
<body>
    <h1>Test-98</h1>
</body>
</html> 