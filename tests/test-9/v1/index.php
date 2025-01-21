<form action="" method="post">
    <input type="text" name="input" id="input" value="readme.txt">
    <input type="submit" value="Submit">
</form>

<?php
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $userInput = $_POST['input'];
        $sanitizedInput = str_replace(["....//", "../"], "", $userInput);
        $filename = $sanitizedInput;

        echo "  Path: " . $filename . "<br>";

        if (is_file($filename)) {
            $handle = fopen($filename, 'r');
            $output = fread($handle, filesize($filename));
            fclose($handle);
            echo nl2br(htmlspecialchars($output));  
        } else {
            echo "File not found or invalid file.";
        }
    }
?>