const express = require('express');
const axios = require('axios');
const https = require('https');

const app = express();
const port = 80;

app.get('/', async (req, res) => {
    const url = 'https://example.com';

    // turn off certificate validation
    const agent = new https.Agent({
        rejectUnauthorized: false
    });

    try {
        const response = await axios.get(url, { httpsAgent: agent });
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Test 36</title>
            </head>
            <body>
                <h1>Test 36</h1>
                <p>Server Response: ${response.data}</p>
            </body>
            </html>
        `);
    } catch (error) {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Test 36</title>
            </head>
            <body>
                <h1>Test 36</h1>
                <p>Error: ${error.message}</p>
            </body>
            </html>
        `);
    }
});


app.listen(port, () => {
  console.log(`Test 36 v2 server running on port ${port}`);
});
