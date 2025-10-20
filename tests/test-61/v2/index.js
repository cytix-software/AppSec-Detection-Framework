
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const key = 'mySuperSecretKey123';
const iv = '1234567890123456';

function encrypt(data) {
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

function decrypt(data) {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
    let decrypted = decipher.update(data, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

app.get('/', (req, res) => {
    res.send(`
        <h1>Encryption and Decryption Demo</h1>
        <form method="post">
            <label for="secret">Enter text to encrypt:</label>
            <input type="text" id="secret" name="secret" required>
            <button type="submit">Encrypt</button>
        </form>
    `);
});

app.post('/', (req, res) => {
    const plaintext = req.body.secret || '';
    const ciphertext = encrypt(plaintext);
    const decrypted = decrypt(ciphertext);
    res.send(`
        <h1>Encryption and Decryption Demo</h1>
        <form method="post">
            <label for="secret">Enter text to encrypt:</label>
            <input type="text" id="secret" name="secret" required>
            <button type="submit">Encrypt</button>
        </form>
        <p><strong>Encrypted:</strong> ${ciphertext}</p>
        <p><strong>Decrypted:</strong> ${decrypted}</p>
    `);
});

app.listen(port, () => {
    console.log(`Test 61 v2 server running on port ${port}`);
});
