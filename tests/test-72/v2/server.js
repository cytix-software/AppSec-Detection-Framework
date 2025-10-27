const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));

// Create some test files for demonstration
const testFiles = ['test1.txt', 'test2.txt', 'test3.txt'];
testFiles.forEach(file => {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, `This is test file: ${file}`);
    }
});

app.get('/', (req, res) => {
    let message = req.query.message || '';
    res.send(`
    <h1>Test 72 v2</h1>
        
        <form action="/delete" method="post">
            <label for="filename">Enter filename to delete:</label><br>
            <input type="text" id="filename" name="filename" placeholder="e.g., test1.txt" style="width: 300px;" required><br>
            <button type="submit">Delete File</button>
        </form>
        ${message ? `
        <div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">
            <strong>Result:</strong> ${message}
        </div>
        ` : ''}
    `);
});

app.post('/delete', (req, res) => {
    const filename = req.body.filename;
    let message = '';

    if (filename) {
        fs.unlink(filename, (err) => {
            if (err) {
                message = `Failed to delete file '${filename}'.`;
            } else {
                message = `File '${filename}' has been deleted successfully.`;
            }
            res.redirect('/?message=' + encodeURIComponent(message));
        });
    } else {
        message = 'Filename not provided.';
        res.redirect('/?message=' + encodeURIComponent(message));
    }
});

app.listen(port, () => {
  console.log(`Test 72 v2 server running on port ${port}`);
});