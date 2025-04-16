<?php
// Explicitly enable external entity processing
libxml_disable_entity_loader(false);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['xmlfile'])) {
    // Load the uploaded XML file with external entity processing enabled
    $xml = simplexml_load_file($_FILES['xmlfile']['tmp_name'], null, LIBXML_NOENT);
    
    // Process the XML and extract data
    $result = [];
    
    if ($xml) {
        // Extract data from the XML
        foreach ($xml->children() as $child) {
            $result[$child->getName()] = (string)$child;
        }
        
        // Display the processed data
        echo '<h3>Processed XML Data</h3>';
        echo '<pre>';
        print_r($result);
        echo '</pre>';
        
        // Also display the raw XML for debugging
        echo '<h3>Raw XML</h3>';
        echo '<pre>';
        echo htmlspecialchars($xml->asXML());
        echo '</pre>';
    } else {
        echo '<p>Error: Failed to parse XML file.</p>';
        $errors = libxml_get_errors();
        foreach ($errors as $error) {
            echo '<p>XML Error: ' . $error->message . '</p>';
        }
        libxml_clear_errors();
    }
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
