const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 80;

app.use(cookieParser());

app.get('/', (req, res) => {
    res.cookie('session_token', 'sensitive_session_value', {
        maxAge: 3600000, // 1 hour
        path: '/',
        secure: false,
        httpOnly: false
    });

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test 45</title>
        </head>
        <body>
            <h1>Test 45</h1>
            <script>document.write("Cookie: " + document.cookie)</script>
        </body>
        </html>
    `);
});

app.listen(port, () => {
  console.log(`Test 45 v2 server running on port ${port}`);
});
