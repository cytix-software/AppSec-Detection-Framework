<?php
// CWE-296: Improper Following of Certificate Validation
// This example demonstrates a cURL request with certificate verification disabled.

$url = 'https://untrusted-root.badssl.com/'; // Example site with invalid certificate

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0); // Disables certificate validation (vulnerability)
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0); // Disables host validation (vulnerability)

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo 'Curl error: ' . curl_error($ch);
} else {
    echo "<h2>Request to $url succeeded (certificate not validated)</h2>\n";
    echo '<pre>' . htmlspecialchars(substr($response, 0, 500)) . "...\n</pre>";
}
curl_close($ch);
?>
