const express = require('express');
const seedrandom = require('seedrandom');

const app = express();

// uses the user ID as the seed for to generate a session ID
function generateSessionID(userID) {
    const rng = seedrandom(userID);
    return rng();
}

app.get('/', (req, res) => {
    const userID = req.query.user ? parseInt(req.query.user, 10) : 42;
    const sessionID = generateSessionID(userID);

    let response = '<h1>Test 87</h1>\n';
    response += `<p><strong>User ID:</strong> ${userID}</p>\n`;
    response += `<p><strong>Generated Session ID:</strong> ${sessionID}</p>\n`;
    res.send(response);
});

const port = 80;
app.listen(port, () => {
    console.log(`Test 87 v2 server running on port ${port}`);
});

