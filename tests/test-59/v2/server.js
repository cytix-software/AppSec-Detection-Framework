const express = require('express');
const app = express();
const port = 80;

const { dbName, dbPassword } = require('./config.js');

app.use(express.urlencoded({ extended: true }));

// Dummy function to simulate connecting to a database
function connectToDB(name, password) {
    return {
        authenticateUser: (username, password) => {
            // Dummy authentication, always returns true
            return true;
        }
    };
}

const db = connectToDB(dbName, dbPassword);

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Test 59 v2</title>
</head>
<body>
    <h1>Test 59 v2</h1>
    <!-- Simple login form -->
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
    let message = '';

    if (username && password) {
        if (db.authenticateUser(username, password)) {
            message = "Login successful!";
        } else {
            message = "Login failed.";
        }
    }

    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Test 59 v2</title>
</head>
<body>
    <h1>Test 59 v2</h1>
    <!-- Simple login form -->
    <form method="post">
        <label>Username: <input type="text" name="username" required></label><br>
        <label>Password: <input type="password" name="password" required></label><br>
        <button type="submit">Login</button>
    </form>
    <p>${message}</p>
</body>
</html>
    `);
});

app.listen(port, () => {
    console.log(`Test 59 v2 server running on port ${port}`);
});