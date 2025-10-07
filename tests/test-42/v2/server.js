const express = require('express');
const app = express();
const port = 80;

// Storing a key in an environment variable
process.env.SECRET_KEY = 'mySuperSecretAPIKey';

// Fetching the sensitive key from the environment variable
const secretKey = process.env.SECRET_KEY;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test 42</title>
        </head>
        <body>
            <h1>Test 42</h1>
            <p><strong>Stored Environment Variable:</strong> ${secretKey}</p>
        </body>
        </html>
    `);
});

app.listen(port, () => {
  console.log(`Test 42 v2 server running on port ${port}`);
});
