const express = require('express');
const crypto = require('crypto');

const app = express();

// Keys for encryption and MAC
const enc_key = crypto.randomBytes(32);
const mac_key = crypto.randomBytes(32);
const plaintext = "This is a sensitive message";
const iv = crypto.randomBytes(12);

// Sender encrypts the message
const cipher = crypto.createCipheriv('aes-256-gcm', enc_key, iv);
const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
const tag = cipher.getAuthTag();

// Sender computes MAC over ciphertext
const mac = crypto.createHmac('sha256', mac_key).update(ciphertext).digest('hex');

// Simulate receiver decrypting the message
const decipher = crypto.createDecipheriv('aes-256-gcm', enc_key, iv);
decipher.setAuthTag(tag);
const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString();

app.get('/', (req, res) => {
    let response = '<h1>Test 84</h1>\n';
    response += `<p><strong>Decrypted message:</strong> ${decrypted}</p>\n`;
    res.send(response);
});

const port = 80;
app.listen(port, () => {
    console.log(`Test 84 v2 server running on port ${port}`);
});

