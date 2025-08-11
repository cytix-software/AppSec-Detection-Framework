<?php
// CWE-324: Use of a Key (Certificate) Past its Expiration Date

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

// Simulate loading a certificate (for demo, use a bundled test cert)
$cert_file = __DIR__ . '/test-cert.pem';
$cert_data = file_get_contents($cert_file);
$cert = openssl_x509_parse($cert_data);

// Simulate verification result (in real code, use openssl_x509_checkpurpose or similar)
$notBefore = parse_cert_date($cert['validFrom']);
$notAfter  = parse_cert_date($cert['validTo']);
$now = time();

// VULNERABLE: Only checks if cert is not yet valid, but not if expired
if ($now < $notBefore) {
    echo "<p style='color:red'>Certificate is not yet valid.</p>";
} else {
    echo "<p style='color:orange'>Certificate is considered to be valid.</p>";
}

echo "<h2>CWE-324: Use of a Key/Certificate Past its Expiration Date</h2>";
echo "<p><strong>Valid from:</strong> " . date('Y-m-d H:i:s', $notBefore) . "</p>";
echo "<p><strong>Valid to:</strong> " . date('Y-m-d H:i:s', $notAfter) . "</p>";
echo "<p><strong>Current time:</strong> " . date('Y-m-d H:i:s', $now) . "</p>";
?>
