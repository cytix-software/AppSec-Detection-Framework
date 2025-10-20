const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 80;

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE users (username TEXT, password TEXT, role TEXT)");
    db.run("INSERT INTO users VALUES ('admin', 'password', 'admin')");
    db.run("INSERT INTO users VALUES ('user', 'password', 'user')");
});

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <h1>Login</h1>
        <form action="/login" method="post">
            <input type="text" name="username" placeholder="Username">
            <input type="password" name="password" placeholder="Password">
            <input type="submit" value="Login">
        </form>
    `);
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // sql query
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    db.get(query, (err, row) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (row) {
            res.send(`<h1>Welcome, ${row.username}</h1><a href="/admin">Admin Page</a>`);
        } else {
            res.send('Invalid credentials');
        }
    });
});

app.get('/admin', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }
    });
});

app.listen(port, () => {
    console.log(`Test 69 v2 server running on port ${port}`);
});
