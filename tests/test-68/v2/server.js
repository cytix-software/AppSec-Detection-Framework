const express = require('express');
const ssi = require('ssi');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 80;

const baseDir = path.join(__dirname);

// SSI middleware configuration
const ssiMiddleware = new ssi({
    baseDir: baseDir,
    ext: '.shtml',
    isSSIMode: true,
});

app.get('/', (req, res, next) => {
    const filePath = path.join(__dirname, 'index.shtml');
    const fileContent = `
        <html>
            <body>
                <h1>SSI Test</h1>
                <!--#include file="${req.query.file || 'include.txt'}" -->
            </body>
        </html>
    `;
    fs.writeFileSync(filePath, fileContent);
    req.url = '/index.shtml';
    ssiMiddleware(req, res, next);
});

// Create a sample file to be included
fs.writeFileSync(path.join(__dirname, 'include.txt'), 'This is the default included file.');


app.listen(port, () => {
    console.log(`Test 68 v2 server running on port ${port}`);
});

