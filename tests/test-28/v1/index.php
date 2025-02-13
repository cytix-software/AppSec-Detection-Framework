<?php
// CWE-494: Download of Code Without Integrity Check
$remote_url = "http://example.com/script.php";
$file_content = file_get_contents($remote_url);
eval($file_content);
echo "File executed successfully.";
?>
