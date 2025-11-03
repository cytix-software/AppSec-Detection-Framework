const express = require('express');
const crypto = require('crypto');

const app = express();

const key = "secretk"; // 8 bytes for DES
const plaintext = "Sensitive data";

// encrypts the plaintext using DES in ECB mode
const cipher = crypto.createCipheriv('des-ecb', key, null);
let ciphertext = cipher.update(plaintext, 'utf8', 'base64');
ciphertext += cipher.final('base64');

app.get('/', (req, res) => {
    let response = '<h1>Test 85</h1>\n';
    response += `<p><strong>Plaintext:</strong> ${plaintext}</p>\n`;
    response += `<p><strong>Encrypted with DES (base64):</strong> ${ciphertext}</p>\n`;
    res.send(response);
});

const port = 80;
app.listen(port, () => {
    console.log(`Test 85 v2 server running on port ${port}`);
});

