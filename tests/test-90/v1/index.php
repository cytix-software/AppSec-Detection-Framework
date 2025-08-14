<?php
// CWE-347: Improper Verification of Cryptographic Signature
// VULNEABLE: Downloads a file from a url but fails to it's verify signature, could potentially be an untrusted source.

echo "<h2>CWE-347: Improper Verification of Cryptographic Signature\n</h2>";


$url = 'https://github.com/githubtraining/hellogitworld/archive/refs/heads/master.zip';
$downloadedFilePath = '/tmp/example.zip';

file_put_contents($downloadedFilePath, file_get_contents($url));

$zip = new ZipArchive();
if ($zip->open($downloadedFilePath) === TRUE) {
    echo "<p>Files downloaded:</p>";
    // List files in the archive
    for ($i = 0; $i < $zip->numFiles; $i++) {
        echo $zip->getNameIndex($i) . "\n";
    }
    $zip->close();
} else {
    echo "Failed to open downloaded package.";
}

echo "<p style='color:red'><strong>VULNERABLE:</strong> A .zip file is downloaded and saved to '/tmp/example.zip but its signature is not verified.</p>\n";
?>