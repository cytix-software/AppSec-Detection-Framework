const express = require('express');
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));

const users = {
    'user1': 'asjfkasnjkfksaf',
    'user2': 'fsdafkjsaf',
    'user3': 'asjkfksajnkfjas'
};

const currentUser = 'user4';
const currentUserPrivileges = 'user';

app.get('/', (req, res) => {
    let message = '';
    if (req.query.message) {
        message = req.query.message;
    }

    res.send(`
        <h1>Test-97</h1>
        <h2> You are currently logged in as 'user4' with 'user' privileges</h2>
        <h2> Reset Passwords</h2>
        <form action="/reset_password" method="post">
            <label for="reset_password">Select a user to reset password for (only for admins):</label>
            <select name="reset_password" id="reset_password">
                ${Object.keys(users).map(username => `<option value="${username}">${username}</option>`).join('')}
            </select>
            <button type="submit">Reset Password</button>
        </form>
        ${message ? `<div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">${message}</div>` : ''}
    `);
});

app.post('/reset_password', (req, res) => {
    const userToReset = req.body.reset_password;
    let message = '';

    if (currentUserPrivileges === 'admin') {
        if (users.hasOwnProperty(userToReset)) {
            users[userToReset] = 'defaultpassword';
            message = `Password for '${userToReset}' has been reset to 'defaultpassword'.`;
        } else {
            message = `User '${userToReset}' does not exist.`;
        }
    } else {
        message = `You do not have permission to reset passwords! Here is the current password for '${userToReset}': '${users[userToReset]}'`;
    }
    res.redirect(`/?message=${encodeURIComponent(message)}`);
});

app.listen(port, () => {
    console.log(`Test 97 server running on port ${port}`);
});
