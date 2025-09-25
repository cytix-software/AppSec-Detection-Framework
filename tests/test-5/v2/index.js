const express = require('express');
const path = require('path');
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/image', (req, res) => {
    const image = req.query.file;

    if (image) {
        const html = `
            <!DOCTYPE html>
            <html>
            <body>
                <img src="./${image}" />
            </body>
            </html>
        `;
        res.send(html);
    } else {
        res.status(400).send('Please provide an image parameter.');
    }
});

app.listen(port, () => {
    console.log('Test 5 V2 App listening on ' + port);
});