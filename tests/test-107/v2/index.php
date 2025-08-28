<?php
// For older PHP: allow entity expansion
if (function_exists('libxml_disable_entity_loader')) {
    libxml_disable_entity_loader(false);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['xmlfile'])) {
    $xmlInput = file_get_contents($_FILES['xmlfile']['tmp_name']);
    $parser = new DOMDocument();
    // Intentionally unsafe: expands all entities and loads DTDs
    $parser->loadXML($xmlInput, LIBXML_NOENT | LIBXML_DTDLOAD);
    // Display the result (may exhaust memory with malicious input)
    echo '<h2>Expanded XML</h2><pre>';
    echo htmlentities($parser->saveXML());
    echo '</pre>';
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>XML Entity Expansion Demo (CWE-776)</title>
</head>
<body>
    <h1>Upload XML File</h1>
    <form method="POST" enctype="multipart/form-data">
        <input type="file" name="xmlfile" accept=".xml" required>
        <button type="submit">Submit</button>
    </form>
</body>
</html>