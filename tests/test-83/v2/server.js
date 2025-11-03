const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();

app.get('/', (req, res) => {
    let response_text = '';
    try {
        const cert_file = path.join(__dirname, 'test-cert.pem');
        const cert_data = fs.readFileSync(cert_file);
        const cert = new crypto.X509Certificate(cert_data);

        const validFrom = new Date(cert.validFrom);
        const validTo = new Date(cert.validTo);
        const now = new Date();

        if (now < validFrom) {
            response_text += "<p style='color:orange'>Certificate is not yet valid.</p>";
        } else if (now > validTo) {
            response_text += "<p style='color:red'>Certificate has expired.</p>";
        } else {
            response_text += "<p style='color:green'>Certificate is considered to be valid.</p>";
        }

        response_text += '<h1>Test 83</h1>';
        response_text += `<p><strong>Valid from:</strong> ${validFrom.toUTCString()}</p>`;
        response_text += `<p><strong>Valid to:</strong> ${validTo.toUTCString()}</p>`;
        response_text += `<p><strong>Current time:</strong> ${now.toUTCString()}</p>`;

    } catch (e) {
        response_text += "Error parsing certificate";
        console.log(e)
    }

    res.send(response_text);
});

const port = 80;
app.listen(port, () => {
    console.log(`Test 83 v2 server running on port ${port}`);
});