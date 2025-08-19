<?php
// Function to parse certificate date from string
function parse_cert_date($dateStr) {
    // Format: YYMMDDHHMMSSZ
    $year = intval(substr($dateStr, 0, 2));
    $year += ($year < 50) ? 2000 : 1900; // OpenSSL convention
    $month = substr($dateStr, 2, 2);
    $day = substr($dateStr, 4, 2);
    $hour = substr($dateStr, 6, 2);
    $min = substr($dateStr, 8, 2);
    $sec = substr($dateStr, 10, 2);
    return mktime($hour, $min, $sec, $month, $day, $year);
}

// Simulate loading a certificate
$cert_file = __DIR__ . '/test-cert.pem';
$cert_data = file_get_contents($cert_file);
$cert = openssl_x509_parse($cert_data);

// Read the certificate validity dates
$validFrom = parse_cert_date($cert['validFrom']);
$validTo = parse_cert_date($cert['validTo']);
$now = time();

// Check if cert is not yet valid or if it has expired
if ($now < $validFrom) {
    echo "<p style='color:orange'>Certificate is not yet valid.</p>";
} else {
    echo "<p style='color:green'>Certificate is considered to be valid.</p>";
}

echo "<h1>Test 83</h1>";
echo "<p><strong>Valid from:</strong> " . date('Y-m-d H:i:s', $validFrom) . "</p>";
echo "<p><strong>Valid to:</strong> " . date('Y-m-d H:i:s', $validTo) . "</p>";
echo "<p><strong>Current time:</strong> " . date('Y-m-d H:i:s', $now) . "</p>";
?>
