<?php
// This script demonstrates file deletion functionality.

// Create some test files for demonstration
$test_files = ['test1.txt', 'test2.txt', 'test3.txt'];
foreach ($test_files as $file) {
    if (!file_exists($file)) {
        file_put_contents($file, "This is test file: $file");
    }
}

$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $filename = $_POST['filename'] ?? '';
    
    if (!empty($filename)) {
        // User input directly controls file deletion
        if (file_exists($filename)) {
            if (unlink($filename)) {
                $message = "File '$filename' has been deleted successfully.";
            } else {
                $message = "Failed to delete file '$filename'.";
            }
        } else {
            $message = "File '$filename' does not exist.";
        }
    }
}
?><!DOCTYPE html>
<html>
<head>
    <title>Test 72</title>
</head>
<body>
    <h1>Test 72</h1>
    
    <form method="post">
        <label for="filename">Enter filename to delete:</label><br>
        <input type="text" id="filename" name="filename" placeholder="e.g., test1.txt" style="width: 300px;" required><br>
        <button type="submit">Delete File</button>
    </form>
    
    <?php if (!empty($message)): ?>
        <div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">
            <strong>Result:</strong> <?php echo htmlspecialchars($message); ?>
        </div>
    <?php endif; ?>
</body>
</html>