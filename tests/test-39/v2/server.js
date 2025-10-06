const express = require('express');
const cookieParser = require('cookie-parser');
const https = require('https');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 443;

app.use(cookieParser());

const options = {
    key: fs.readFileSync('./ssl/server.key'),
    cert: fs.readFileSync('./ssl/server.crt')
};

app.get('/', (req, res) => {
    const sessionId = uuidv4();
    // Set a sensitive cookie without the Secure attribute
    res.cookie("session_id", sessionId, {
        httpOnly: true,  // Protects against JavaScript access (but still vulnerable over non-secure connection)
        sameSite: "Strict" // Helps prevent CSRF attacks
    });

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test 39</title>
        </head>
        <body>
            <h1>Test 39</h1>
            <p>A cookie has been set.</p>
        </body>
        </html>
    `);
});

const server = https.createServer(options, app);

server.listen(port, () => {
  console.log(`Test 39 v2 server running on port ${port}`);
});
