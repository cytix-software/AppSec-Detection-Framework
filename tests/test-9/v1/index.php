<?php
$filename = $_GET['path'] ?? '';
$filePath = __DIR__ . '/path/' . $filename;

if (is_file($filePath)) {
    echo nl2br(htmlspecialchars(file_get_contents($filePath)));
} else {
    echo "File not found or invalid file.";
}
?>
