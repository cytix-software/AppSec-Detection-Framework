const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 80;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test 91</title>
        </head>
        <body>
            <h1>Test 91</h1>
            <form method="post">
                <label for="algorithm">Select a hashing algorithm to use for password storage</label><br>
                <input type="text" id="algorithm" name="algorithm" placeholder="md5, sha-1, or sha256">
                <button type="submit">Select</button>
            </form>
        </body>
        </html>
    `);
});

app.post('/', (req, res) => {
    const password = 'password';
    let password_hash = '';
    let message = '';
    const algorithm = req.body.algorithm || '';

    if (algorithm == 'md5') {
        password_hash = crypto.createHash('md5').update(password).digest('hex');
        message = 'Password has been hashed using md5 (VULNERABLE)';
    } else if (algorithm == 'sha-1') {
        password_hash = crypto.createHash('sha1').update(password).digest('hex');
        message = 'Password has been hashed using sha-1 (VULNERABLE)';
    } else if (algorithm == 'sha256') {
        password_hash = crypto.createHash('sha256').update(password).digest('hex');
        message = 'Password has been hashed using sha256 (SECURE)';
    } else {
        message = 'Invalid hash algorithm';
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test 91</title>
        </head>
        <body>
            <h1>Test 91</h1>
            <form method="post">
                <label for="algorithm">Select a hashing algorithm to use for password storage</label><br>
                <input type="text" id="algorithm" name="algorithm" placeholder="md5, sha-1, or sha256" value="${algorithm}">
                <button type="submit">Select</button>
            </form>
            <div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">
                ${message}<br>
                ${password_hash}
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Test 91 v2 server running on port ${port}`);
});
