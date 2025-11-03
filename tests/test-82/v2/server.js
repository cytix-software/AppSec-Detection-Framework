const express = require('express');
const crypto = require('crypto');

const app = express();

// key and nonce for AES-256 encryption
const key = crypto.randomBytes(32);
const nonce = Buffer.from('AAAAAAAAAAAA', 'base64');

const plaintext1 = "Secret message 1";
const plaintext2 = "Secret message 2";

// Encrypt both messages with the same key and nonce
const cipher1 = crypto.createCipheriv('aes-256-gcm', key, nonce);
const ciphertext1 = Buffer.concat([cipher1.update(plaintext1, 'utf8'), cipher1.final()]);
const tag1 = cipher1.getAuthTag();

const cipher2 = crypto.createCipheriv('aes-256-gcm', key, nonce);
const ciphertext2 = Buffer.concat([cipher2.update(plaintext2, 'utf8'), cipher2.final()]);
const tag2 = cipher2.getAuthTag();

app.get('/', (req, res) => {
    let response = '<h1>Test 82</h1>';
    response += `<p><strong>Key (base64):</strong> ${key.toString('base64')}</p>`;
    response += `<p><strong>Nonce (base64):</strong> ${nonce.toString('base64')}</p>`;
    response += `<p><strong>Plaintext 1:</strong> ${plaintext1}</p>`;
    response += `<p><strong>Plaintext 2:</strong> ${plaintext2}</p>`;
    response += `<p><strong>Ciphertext 1 (base64):</strong> ${ciphertext1.toString('base64')}</p>`;
    response += `<p><strong>Ciphertext 2 (base64):</strong> ${ciphertext2.toString('base64')}</p>`;
    res.send(response);
});

const port = 80;
app.listen(port, () => {
    console.log(`Test 82 v2 server running on port ${port}`);
});