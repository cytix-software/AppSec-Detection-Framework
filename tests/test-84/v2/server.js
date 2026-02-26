const express = require('express');
const crypto = require('crypto');

const app = express();

// Keys for encryption and MAC
const enc_key = crypto.randomBytes(32); // AES-256 key
const mac_key = crypto.randomBytes(32); // HMAC key

const plaintext = "This is a sensitive message";
const iv = crypto.randomBytes(16); // CBC needs 16-byte IV

// Sender encrypts the message
const cipher = crypto.createCipheriv('aes-256-cbc', enc_key, iv);
const ciphertext = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);

// Sender computes MAC over (iv || ciphertext)
const mac = crypto.createHmac('sha256', mac_key).update(Buffer.concat([iv, ciphertext])).digest('hex');

// --- Simulated receiver side ---
const decipher = crypto.createDecipheriv('aes-256-cbc', enc_key, iv);
const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');

app.get('/', (req, res) => {
  let response = '<h1>Test 84</h1>\n';
  response += `<p><strong>Decrypted message:</strong> ${decrypted}</p>\n`;

  res.send(response);
});

const port = 80;
app.listen(port, () => {
  console.log(`Test 84 v2 server running on port ${port}`);
});