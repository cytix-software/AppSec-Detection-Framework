const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 80;

app.use(bodyParser.urlencoded({ extended: true }));

const publicKeyString = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqIoGskIMwc03mqspf1mu
V3FZvjlVm432ryA3PCHC17Xjw/YiLdWbLVv/5WmbFsQrdRpUBHzKalWy6tQV8kla
DzMKPMKtrG+Kse2pMAfb6ZZmHPl1jyA/tDdWSGoNdQ2PxGQIKbP0cELvsDF9UbzY
jzT+KKJn8WeqRI9cb+QSYyGAIbqYRBCFawnCdJi1WHUz0xX6I2OApphhv68H5TNK
j32QbpWJeF5awWUxQxlBJERxdS/+XnblELtYjCWRtSUsn8wNnRRLH7ByV1+dutiw
16+IAlxIzEwoRPellawtu+Mk6UAUHbyiA1GqZsrhl7e0ZdOlHbq3b3tL8He0+/Y3
LQIDAQAB
-----END PUBLIC KEY-----`;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test 92</title>
        </head>
        <body>
            <h1>Test 92</h1>
            <form action="" method="post">
                <label for="name">Name:</label><br>
                <input type="text" id="name" name="name"><br>
                <label for="message">Message:</label><br>
                <input type="text" id="message" name="message"><br><br>
                <input type="submit" value="Submit">
            </form>
        </body>
        </html>
    `);
});

app.post('/', (req, res) => {
    const message = req.body.message || '';
    let encryptedMessage = '';
    let successMessage = '';

    if (message) {
        try {
            const bufferMessage = Buffer.from(message, 'utf8');
            encryptedMessage = crypto.publicEncrypt(
                {
                    key: publicKeyString,
                    padding: crypto.constants.RSA_PKCS1_PADDING, // VULNERABLE
                },
                bufferMessage
            );
            successMessage = 'Message encrypted successfully!';
        } catch (error) {
            successMessage = `<p style='color:red'>Error encrypting message: ${error.message}</p>`;
        }
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test 92</title>
        </head>
        <body>
            <h1>Test 92</h1>
            <form action="" method="post">
                <label for="name">Name:</label><br>
                <input type="text" id="name" name="name" value="${req.body.name || ''}"><br>
                <label for="message">Message:</label><br>
                <input type="text" id="message" name="message" value="${message}"><br><br>
                <input type="submit" value="Submit">
            </form>
            ${successMessage ? `
                <div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">
                    <p>${successMessage}</p>
                </div>
            ` : ''}
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Test 92 v2 server running on port ${port}`);
});
