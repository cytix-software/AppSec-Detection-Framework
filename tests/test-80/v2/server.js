const express = require('express');
const axios = require('axios');
const https = require('https');

const app = express();

const agent = new https.Agent({
  rejectUnauthorized: false
});

app.get('/', async (req, res) => {
    const url = 'https://untrusted-root.badssl.com/';
    let response_text = '';
    try {
        const response = await axios.get(url, { httpsAgent: agent });
        response_text += `<h2>Request to ${url} succeeded</h2>\n`;
        response_text += '<pre>' + response.data.substring(0, 500) + '...\n</pre>';
    } catch (error) {
        response_text += 'Curl error: ' + error;
    }
    res.send(response_text);
});

const port = 80;
app.listen(port, () => {
    console.log(`Test 80 v2 server running on port ${port}`);
});