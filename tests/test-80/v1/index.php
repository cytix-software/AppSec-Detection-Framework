<?php
// This example demonstrates a cURL request

$url = 'https://untrusted-root.badssl.com/'; // Example site
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Curl error: ' . curl_error($ch);
} else {
    echo "<h2>Request to $url succeeded</h2>\n";
    echo '<pre>' . htmlspecialchars(substr($response, 0, 500)) . "...\n</pre>";
}
curl_close($ch);
?>
