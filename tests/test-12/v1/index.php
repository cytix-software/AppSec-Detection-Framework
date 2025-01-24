<?php
// Insecure temporary file creation
$temp_filename = tempnam("/tmp", "vulnerable_");

if ($temp_filename) {
    echo "Temporary file created at: " . $temp_filename . "\n";
    chmod($temp_filename, 0644); // Insecure Permissions.

    // Write Data to file.
    $file = fopen($temp_filename, 'wb');
    if ($file) {
        $data = "Sensitive data flavour.";
        fwrite($file, $data);
        fclose($file); 

        // Wait to simulate process.
        sleep(10); 

        // Delete file.
        if (file_exists($temp_filename)) {
            unlink($temp_filename);
            echo "Temporary file deleted.";
        } else {
            echo "Temporary file does not exist when attempting to delete.\n";
        }
    } else {
        echo "Failed to open temporary file for writing.\n";
    }
} else {
    echo "Failed to create temporary file.\n";
}
?>
