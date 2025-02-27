<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['xmlfile'])) {
    // Load the uploaded XML file
    $xml = simplexml_load_file($_FILES['xmlfile']['tmp_name']);
    
    // Simply echo the content of the XML document (which may include external entity references)
    echo '<h3>Processed XML</h3>';
    echo '<pre>';
    echo htmlspecialchars($xml->asXML());
    echo '</pre>';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>XXE Vulnerability Example</title>
</head>
<body>
    <h1>Upload an XML file to demonstrate XXE vulnerability</h1>
    <form method="POST" enctype="multipart/form-data">
        <input type="file" name="xmlfile" accept=".xml" required>
        <button type="submit">Upload</button>
    </form>
</body>
</html>
