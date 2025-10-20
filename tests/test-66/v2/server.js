const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 80;

// Create a public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}

app.get('/', (req, res) => {
    const name = req.query.name || 'guest';
    const content = `<h1>Hello, ${name}!</h1>`;
    const filePath = path.join(publicDir, `${name}.html`);

    fs.writeFile(filePath, content, (err) => {
        if (err) {
            return res.status(500).send('Error creating file');
        }
        res.send(`File ${name}.html created. <a href="/public/${name}.html">View</a>`);
    });
});

app.use('/public', express.static(publicDir));

app.listen(port, () => {
    console.log(`Test 66 v2 server running on port ${port}`);
});
