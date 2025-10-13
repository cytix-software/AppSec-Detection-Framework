const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test 58 v2</title>
</head>
<body>
    <h1>Test 58 v2</h1>
    <!-- Password input form -->
    <form method="post">
        <label for="password">Enter a password (will be stored in a persistent cookie):</label><br>
        <input type="text" id="password" name="password" required>
        <button type="submit">Login</button>
    </form>
</body>
</html>
    `);
});

app.post('/', (req, res) => {
    const { password } = req.body;
    if (password) {
        res.cookie('user_password', password, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
        res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test 58 v2</title>
</head>
<body>
    <h1>Test 58 v2</h1>
    <!-- Password input form -->
    <form method="post">
        <label for="password">Enter a password (will be stored in a persistent cookie):</label><br>
        <input type="text" id="password" name="password" required>
        <button type="submit">Login</button>
    </form>
    <div><span style='color:green;'>Password stored!</span></div>
</body>
</html>
        `);
    } else {
        res.redirect('/');
    }
});

app.listen(port, () => {
    console.log(`Test 58 v2 server running on port ${port}`);
});