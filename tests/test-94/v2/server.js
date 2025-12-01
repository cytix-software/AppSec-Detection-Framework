const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const he = require('he');

const app = express();
const port = 80;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test 94 v2</title>
        </head>
        <body>
            <h1>Test 94 v2 - Proxy</h1>
            <form method="post">
                <label for="url">Enter URL to fetch:</label>
                <input type="text" id="url" name="url" size="50" placeholder="http://example.com">
                <button type="submit">Fetch</button>
            </form>
            <hr>
        </body>
        </html>
    `);
});

app.post('/', async (req, res) => {
    const url = req.body.url;
    let content = '';
    let error = '';

    if (url) {
        try {
            const response = await axios.get(url);
            content = response.data;
        } catch (err) {
            error = `Failed to fetch content from: ${he.encode(url)}`;
        }
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test 94 v2</title>
        </head>
        <body>
            <h1>Test 94 v2 - Proxy</h1>
            <form method="post">
                <label for="url">Enter URL to fetch:</label>
                <input type="text" id="url" name="url" size="50" placeholder="http://example.com" value="${url ? he.encode(url) : ''}">
                <button type="submit">Fetch</button>
            </form>
            <hr>
            ${error ? `<p style='color:red'>${error}</p>` : ''}
            ${content ? `
                <h2>Fetched Content:</h2>
                <pre style='white-space: pre-wrap; word-break: break-all; background: #f8f8f8; border: 1px solid #ccc; padding: 10px;'>${he.encode(String(content))}</pre>
            ` : ''}
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log("Test 94 v2 server running on port " + port);
});
