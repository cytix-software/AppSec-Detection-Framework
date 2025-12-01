const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port = 80;

app.use(cookieParser());

const users = {
    'user1': 'password1',
    'user2': 'password2',
    'user3': 'password3'
};

app.get('/', (req, res) => {
    const cookieName = "authenticated";
    let authenticated = req.cookies[cookieName];

    if (authenticated !== 'true') {
        res.cookie(cookieName, 'false', { maxAge: 86400 * 1000, httpOnly: false });
    }

    let body = '<h1>Test-100</h1>';
    if (authenticated === 'true') {
        body += `<p>You are authenticated.</p>`;
        body += `<p>User credentials: ${JSON.stringify(users)}</p>`;
    } else {
        body += `<p>You are not authenticated (no cookie is set or value is false).</p>`;
    }

    res.send(body);
});

app.listen(port, () => {
    console.log(`Test 100 server running on port ${port}`);
});
