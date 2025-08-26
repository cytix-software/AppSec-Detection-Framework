<?php
$temp_filename = tempnam("/tmp", "test12");

if ($temp_filename) {
    echo "Temporary file created at: " . $temp_filename . "<br /><br />";
    chmod($temp_filename, 0644);

    // Write Data to file.
    $file = fopen($temp_filename, 'wb');
    if ($file) {
        $data = "Sensitive data flavour.";
        fwrite($file, $data);
        fclose($file); 

        // Reads file.
        echo "File contents: ";
        include($temp_filename);
        echo "<br /><br />"; 

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
