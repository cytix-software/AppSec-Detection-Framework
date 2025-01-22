<?php
// Create a temporary file in the system's temp directory
$tempFile = tempnam(sys_get_temp_dir(), 'tmp_');

// Write some sample content to the temporary file
file_put_contents($tempFile, "File flavour.\n");

// Output the temporary file path
echo "Temporary file created at: $tempFile<br>";
echo "Data written to the temporary file.<br>";

// Simulate processing by keeping the file for 1 minute
echo "Processing... The temporary file will be deleted in 1 minute.<br>";
sleep(60); // Wait for 60 seconds

// Delete the temporary file after processing
if (file_exists($tempFile)) {
    unlink($tempFile);
    echo "Temporary file deleted.<br>";
} else {
    echo "Temporary file not found for deletion.<br>";
}
?>
