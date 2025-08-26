<?php
echo "<h1>Test 90\n</h1>";

// example url to download a .zip file
$url = 'https://github.com/githubtraining/hellogitworld/archive/refs/heads/master.zip';
$downloadedFilePath = '/tmp/example.zip';

// download the file
file_put_contents($downloadedFilePath, file_get_contents($url));

// unzips the file and saves it
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
?>