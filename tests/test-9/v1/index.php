<form action="" method="post"> 
    <input type="text" name="input" id="input" value="readme.txt">
    <input type="submit" value="Submit">
</form>

<?php
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        // User input is directly used to construct the file path.
        $filename = "./uploads/";  // Intended directory for file access
        $filename .= $_POST['input'];  // Append user input to path

        // Attempt to open the file based on user input
        if (is_file($filename)) {
            $handle = fopen($filename, 'r');
            $output = fread($handle, filesize($filename));
            fclose($handle);
            echo nl2br(htmlspecialchars($output));  // Display file contents
        } else {
            echo "File not found or invalid file.";
        }
    }
?>
