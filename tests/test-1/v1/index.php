<form action="" method="post">
    <input type="text" name="input" id="input" value="readme.txt">
    <input type="submit" value="Submit">
</form>

<?php
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {    
        $filename = "./";
        $filename .= $_POST['input'];
        $handle = fopen("$filename", 'r');
        $output = fread($handle, filesize($filename));
        fclose($handle);
        echo $output;    
    }
?>