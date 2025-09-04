<!DOCTYPE html>
<html>
<head>
    <title>Test 36</title>
</head>
<body>
    <h1>Test 36</h1>
<?php

$url = "https://example.com"; // Target URL

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Disable certificate validation

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo "cURL error: " . curl_error($ch);
} else {
    echo "Server Response: " . htmlspecialchars($response);
}

curl_close($ch);

?>
</body>
</html>
