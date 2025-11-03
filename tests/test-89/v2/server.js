const express = require('express');
const seedrandom = require('seedrandom');

const app = express();

let seed = 324;

// generates a session ID based on the seed, incrementing the seed each time
function generateSessionID() {
    const rng = seedrandom(seed);
    const session_id = rng();
    seed += 1;
    return session_id;
}

app.get('/', (req, res) => {
    const user1_session_id = generateSessionID();

    let response = '<h1>Test 89</h1>';
    response += `<p>User 1's session ID: ${user1_session_id}</p>\n`;
    res.send(response);
});

const port = 80;
app.listen(port, () => {
    console.log(`Test 89 v2 server running on port ${port}`);
});

