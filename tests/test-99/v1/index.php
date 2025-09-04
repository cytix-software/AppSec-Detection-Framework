<?php

// allows users to upload files
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['userfile'])) {
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    $uploadFile = $uploadDir . basename($_FILES['userfile']['name']);
    if (move_uploaded_file($_FILES['userfile']['tmp_name'], $uploadFile)) {
        echo "File uploaded successfully.";
    } else {
        echo "File upload failed.";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test-99</title>
</head>
<body>
    <h1>Test-99</h1>
    <form enctype="multipart/form-data" method="POST">
        <input type="file" name="userfile" required>
        <button type="submit">Upload</button>
    </form>
</body>
</html>
