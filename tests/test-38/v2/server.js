const express = require('express');
const app = express();
const port = 80;

// Approved IP address for authentication
const approved_ip = "192.168.1.100";

app.get('/', (req, res) => {
    // Get the user's IP address from the request
    const user_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    let message;
    // Check if the user's IP matches the approved IP
    if (user_ip === approved_ip) {
        message = "Authentication successful. Welcome, admin!";
    } else {
        message = "Access denied. Unauthorized user.";
    }

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test 38</title>
        </head>
        <body>
            <h1>Test 38</h1>
            <p>${message}</p>
            <p>Your IP address is: ${user_ip}</p>
        </body>
        </html>
    `);
});

app.listen(port, () => {
  console.log(`Test 38 v2 server running on port ${port}`);
});
