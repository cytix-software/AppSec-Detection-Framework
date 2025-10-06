const express = require('express');
const multer = require('multer');
const libxmljs = require('libxmljs');
const app = express();
const port = 80;

const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test 40</title>
        </head>
        <body>
            <h1>Test 40</h1>
            <form method="POST" enctype="multipart/form-data">
                <input type="file" name="xmlfile" accept=".xml" required>
                <button type="submit">Upload</button>
            </form>
        </body>
        </html>
    `);
});

app.post('/', upload.single('xmlfile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const xmlString = req.file.buffer.toString();

    try {
        const xmlDoc = libxmljs.parseXml(xmlString, { noent: true });

        let result = {};
        xmlDoc.root().childNodes().forEach(child => {
            if (child.type() === 'element') {
                result[child.name()] = child.text();
            }
        });

        res.send(`
            <h3>Processed XML Data</h3>
            <pre>${JSON.stringify(result, null, 2)}</pre>
            <h3>Raw XML</h3>
            <pre>${xmlString.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
        `);
    } catch (e) {
        res.status(500).send(`<p>Error: Failed to parse XML file.</p><p>XML Error: ${e.message}</p>`);
    }
});

app.listen(port, () => {
  console.log(`Test 40 v2 server running on port ${port}`);
});
