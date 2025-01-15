<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['file'])) {
    $uploadDirectory = '/var/www/html/uploads/';
    $fileName = $_FILES['file']['name'];
    $filePath = $uploadDirectory . $fileName;

    if (move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
        echo "File uploaded successfully.";
    } else {
        echo "Failed to upload the file.";
    }
}
?>

<form action="" method="post" enctype="multipart/form-data">
    <label for="file">Choose a file to upload:</label>
    <input type="file" name="file" id="file" />
    <input type="submit" value="Upload" />
</form>
