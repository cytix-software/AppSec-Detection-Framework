const express = require('express');
const app = express();

// Simulates a key exchange

// public parameters
const prime = 23;
const base = 5;

// Each party picks a secret
const aliceSecret = 6; // Alice's private key
const bobPublic = 8;   // Bob's public value, received from Bob

// Alice computes her public value
const alicePublic = Math.pow(base, aliceSecret) % prime;

// Alice computes shared key using Bob's public value
const sharedKey = Math.pow(bobPublic, aliceSecret) % prime;

app.get('/', (req, res) => {
    let response = '<h1>Test 81</h1>\n';
    response += '<p><strong>Shared key:</strong> <strong>' + sharedKey + '</strong></p>\n';
    res.send(response);
});

const port = 80;
app.listen(port, () => {
    console.log(`Test 81 v2 server running on port ${port}`);
});