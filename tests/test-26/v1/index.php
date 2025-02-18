<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $uploadDir = 'uploads/';
    $fileName = basename($_FILES['file']['name']);
    $filePath = $uploadDir . $fileName;
    
    // Check file extension - only checks extension to determine validity.
    $allowedExtensions = ['jpg', 'png', 'gif', 'txt', 'pdf'];
    $fileExt = pathinfo($fileName, PATHINFO_EXTENSION);
    
    if (in_array($fileExt, $allowedExtensions)) {
        if (move_uploaded_file($_FILES['file']['tmp_name'], $filePath)) {
            echo "File uploaded successfully: <a href='$filePath'>$fileName</a>";
        } else {
            echo "Failed to upload file.";
        }
    } else {
        echo "Invalid file type.";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Vulnerable File Upload</title>
</head>
<body>
    <h2>Upload a File</h2>
    <form action="" method="post" enctype="multipart/form-data">
        <input type="file" name="file" required>
        <input type="submit" value="Upload">
    </form>
</body>
</html>
