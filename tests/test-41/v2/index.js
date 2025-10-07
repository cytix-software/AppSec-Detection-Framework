const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 80;

app.use(cookieParser());

app.get('/', (req, res) => {
    const userID = "user123"; 
    // Store the user ID in a cookie
    res.cookie("userID", userID, { maxAge: 3600000, httpOnly: true }); // Cookie valid for 1 hour

    let message;
    // Check if the cookie is set and display the stored value
    if (req.cookies.userID) {
        message = "Welcome back, user ID: " + req.cookies.userID;
    } else {
        message = "Please log in.";
    }

    res.send(`
        <!DOCTYPE html>
        <html>s
        <head>
            <title>Test 41</title>
        </head>
        <body>
            <h1>Test 41</h1>
            <p>${message}</p>
        </body>
        </html>
    `);
});

app.listen(port, () => {
  console.log(`Test 41 v2 server running on port ${port}`);
});
