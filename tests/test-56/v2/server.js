const express = require('express');
const session = require('express-session');
const app = express();
const port = 80;

app.use(session({
    secret: 'a-very-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Not using HTTPS in this test case
}));

// Simulate user authentication
app.use((req, res, next) => {
    if (!req.session.user) {
        req.session.user = {
            role: 'user' // Regular user role
        };
    }
    next();
});

// returns admin data
function getAdminData() {
    return {
        admin_users: [
            { username: 'admin1', email: 'admin1@example.com' },
            { username: 'admin2', email: 'admin2@example.com' }
        ],
        system_settings: {
            maintenance_mode: false,
            debug_mode: true
        }
    };
}

// Handle admin data request
app.get('/admin-data', (req, res) => {
    res.json(getAdminData());
});

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
    <title>Test 56</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .important { color: red; }
    </style>
</head>
<body>
    <h1>Test 56 v2</h1>
    <p>Current role: <span class="important">${req.session.user.role}</span></p>
    <button onclick="fetchAdminData()" disabled>Get Admin Data</button>
    <div id="result" style="margin-top: 20px;"></div>

    <script>
    function fetchAdminData() {
        fetch('/admin-data')
            .then(response => response.json())
            .then(data => {
                document.getElementById('result').innerHTML =
                    '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            });
    }
    </script>
</body>
</html>
    `);
});

app.listen(port, () => {
    console.log(`Test 56 v2 server running on port ${port}`);
});