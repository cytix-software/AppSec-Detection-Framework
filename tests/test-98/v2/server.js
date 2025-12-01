const express = require('express');
const fs = require('fs');
const app = express();
const port = 80;

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

const db_password = config.database_password || '';
const api_key = config.api_key || '';
const smtp_password = config.smtp_password || '';

app.get('/', (req, res) => {
    res.send(`
        <h1>Test-98</h1>
        <p>Database Password: ${db_password}</p>
        <p>API Key: ${api_key}</p>
        <p>SMTP Password: ${smtp_password}</p>
    `);
});

app.listen(port, () => {
    console.log(`Test 98 server running on port ${port}`);
});
