const express = require('express');
const session = require('express-session');
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

let users = ['user1', 'user2', 'user3'];
let user = null;

function createUser() {
    return {
        username: 'user',
        password: 'password',
        role: 'admin'
    };
}

app.get('/', (req, res) => {
    let message = '';
    let message2 = '';
    let message3 = '';

    if (req.query.message) {
        message = req.query.message;
    }
    if (req.query.message2) {
        message2 = req.query.message2;
    }
    if (req.query.message3) {
        message3 = req.query.message3;
    }

    res.send(`
        <h1>Test-96</h1>
        <h2>Create User</h2>
        <form action="/create_user" method="post">
            <button type="submit" name="create_user" value="1">Create User</button>
        </form>
        ${message ? `<div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">${message}</div>` : ''}
        <h2>Login</h2>
        <form action="/login" method="post">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" required>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">Login</button>
        </form>
        ${message2 ? `<div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">${message2}</div>` : ''}
        <h2> Manage Users</h2>
        <form action="/delete_user" method="post">
            <label for="username_delete">Select user to delete:</label>
            <select name="username_delete" id="username_delete">
                ${users.map(user => `<option value="${user}">${user}</option>`).join('')}
            </select>
            <button type="submit">Delete User</button>
        </form>
        ${message3 ? `<div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">${message3}</div>` : ''}
    `);
});

app.post('/create_user', (req, res) => {
    user = createUser();
    res.redirect('/?message=User created with default credentials (user & password), and with admin privileges.');
});

app.post('/login', (req, res) => {
    if (req.body.username === 'user' && req.body.password === 'password') {
        req.session.logged_in = true;
        req.session.is_admin = true;
        res.redirect('/?message2=Login successful!');
    } else {
        res.redirect('/?message2=Invalid credentials!');
    }
});

app.post('/delete_user', (req, res) => {
    if (req.session.logged_in && req.session.is_admin) {
        const username_to_delete = req.body.username_delete;
        if (users.includes(username_to_delete)) {
            users = users.filter(u => u !== username_to_delete);
            res.redirect(`/?message3=User '${username_to_delete}' deleted successfully.`);
        } else {
            res.redirect(`/?message3=User '${username_to_delete}' does not exist.`);
        }
    } else {
        res.redirect('/?message3=You must be logged in with admin privileges to delete a user.');
    }
});

app.listen(port, () => {
    console.log(`Test 96 server running on port ${port}`);
});
