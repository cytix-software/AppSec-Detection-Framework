<?php
// CWE-311 & CWE-312
// Simulating an insecure practice: storing a sensitive key in an environment variable
putenv("SECRET_KEY=mySuperSecretAPIKey");

// Fetching the sensitive key from the environment variable
$secretKey = getenv("SECRET_KEY");

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test 42</title>
</head>
<body>
    <p><strong>Stored Environment Variable:</strong> <?php echo htmlspecialchars($secretKey); ?></p>
</body>
</html>
