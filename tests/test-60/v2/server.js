const express = require('express');
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Test 60 v2</title>
</head>
<body>
    <h1>Test 60 v2</h1>
    <h2>Login</h2>
    <form method="post">
        <label>Username: <input type="text" name="username" required></label><br>
        <label>Password: <input type="password" name="password" required></label><br>
        <button type="submit">Login</button>
    </form>
</body>
</html>
    `);
});

app.post('/', (req, res) => {
    const { username, password } = req.body;

    // Simulate a database connection failure
    const db_connected = false;

    if (!db_connected) {
        const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        res.status(500).send(`Database connection failed!<br>SQL: ${sql}`);
    }
});

app.listen(port, () => {
    console.log(`Test 60 v2 server running on port ${port}`);
});