const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

// This example stores a password, base64 encoded within a config file

// Simulate config file with base64-encoded password
const ini = `password = "${Buffer.from('password123').toString('base64')}"\n`;
fs.writeFileSync(path.join(__dirname, 'config.properties'), ini);

// Simulates connecting to a database.
function db_connect(user, pass) {
    let message = `Attempting to connect with user '${user}' and password '${pass}'...<br>`;
    if (user === 'admin' && pass === 'password123') {
        message += "<strong>Connection Successful!</strong><br>";
        return { success: true, message };
    } else {
        message += "<strong>Connection Failed.</strong><br>";
        return { success: false, message };
    }
}

// Read config file
const configContent = fs.readFileSync(path.join(__dirname, 'config.properties'), 'utf8');
const passwordMatch = configContent.match(/password = "(.*)"/);
const encoded_password = passwordMatch ? passwordMatch[1] : '';

// Decode the password
const decoded_password = Buffer.from(encoded_password, 'base64').toString('ascii');

app.get('/', (req, res) => {
    let response = `Encoded password from config: ${encoded_password}<br>`;
    response += `Decoded password: ${decoded_password}<br><hr>`;
    const connectionResult = db_connect('admin', decoded_password);
    response += connectionResult.message;
    response += '<h1>Test 79</h1>';
    res.send(response);
});

const port = 80;
app.listen(port, () => {
    console.log(`Test 79 v2 server running on port ${port}`);
});