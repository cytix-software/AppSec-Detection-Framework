const express = require('express');
const seedrandom = require('seedrandom');

const app = express();

// generates an account ID using the current time as the seed
function generateAccountID() {
    const rng = seedrandom(new Date().getTime());
    return rng();
}

app.get('/', (req, res) => {
    const accountID = generateAccountID();
    const seedTime = new Date().toUTCString();

    let response = '<h1>Test 88</h1>\n';
    response += `<p><strong>Seed (current time):</strong> ${seedTime}</p>\n`;
    response += `<p><strong>Generated Account ID:</strong> ${accountID}</p>\n`;
    res.send(response);
});

const port = 80;
app.listen(port, () => {
    console.log(`Test 88 v2 server running on port ${port}`);
});

