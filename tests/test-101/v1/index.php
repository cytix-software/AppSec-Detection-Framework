<?php
// This page allows deleting a file using a GET request.
if (isset($_GET['delete'])) {
    $file = $_GET['delete'];
    if (file_exists($file)) {
        unlink($file); // Attempt to delete the file
        $message = "File '$file' deleted successfully.";
    } else {
        $message = "File '$file' does not exist.";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test 101</title>
</head>
<body>
    <h1>Test 101</h1>
    <form method="get">
        <label>File name to delete: <input type="text" name="delete"></label>
        <button type="submit">Delete</button>
    </form>
    <?php if (!empty($message)) echo "<p>$message</p>"; ?>
</body>
</html>