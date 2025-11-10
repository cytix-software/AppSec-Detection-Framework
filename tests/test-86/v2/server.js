const express = require('express');
const crypto = require('crypto');

const app = express();

// Using Math.random() to generate a cryptographic key
let key = '';
for (let i = 0; i < 16; i++) { // 128-bit key
    key += String.fromCharCode(Math.floor(Math.random() * 256));
}

// encrypts the message with aes using the key
const plaintext = "Sensitive message";
const iv = crypto.randomBytes(16);
const cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(key, 'binary'), iv);
let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
ciphertext += cipher.final('base64');

app.get('/', (req, res) => {
    let response = '<h2>Test 86</h2>\n';
    response += `<p><strong>Plaintext:</strong> ${plaintext}</p>\n`;
    response += `<p><strong>Ciphertext (base64):</strong> ${ciphertext}</p>\n`;
    res.send(response);
});

const port = 80;
app.listen(port, () => {
    console.log(`Test 86 v2 server running on port ${port}`);
});

