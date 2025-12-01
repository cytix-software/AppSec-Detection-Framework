const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 80;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test 93</title>
        </head>
        <body>
            <h1>Test 93</h1>
            <h2>Enter Admin Credentials to access '/secret.txt'.</h2>
            <form action="/login" method="post">
                <label for="username">Username:</label><br>
                <input type="text" id="username" name="username"><br>
                <label for="password">Password:</label><br>
                <input type="password" id="password" name="password"><br><br>
                <input type="submit" value="Submit">
            </form>
        </body>
        </html>
    `);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'secret_password') {
        res.redirect('/secret.txt');
    } else {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Test 93</title>
            </head>
            <body>
                <h1>Test 93</h1>
                <h2>Enter Admin Credentials to access '/secret.txt'.</h2>
                <form action="/login" method="post">
                    <label for="username">Username:</label><br>
                    <input type="text" id="username" name="username"><br>
                    <label for="password">Password:</label><br>
                    <input type="password" id="password" name="password"><br><br>
                    <input type="submit" value="Submit">
                </form>
                <div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">
                    Invalid credentials!
                </div>
            </body>
            </html>
        `);
    }
});

app.listen(port, () => {
    console.log(`Test 93 v2 server running on port ${port}`);
});
