<?php
// Storing a key in an environment variable
putenv("SECRET_KEY=mySuperSecretAPIKey");

// Fetching the sensitive key from the environment variable
$secretKey = getenv("SECRET_KEY");

?>

<!DOCTYPE html>
<html>
<head>
    <title>Test 42</title>
</head>
<body>
    <h1>Test 42</h1>
    <p><strong>Stored Environment Variable:</strong> <?php echo htmlspecialchars($secretKey); ?></p>
</body>
</html>
