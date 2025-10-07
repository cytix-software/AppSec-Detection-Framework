const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    // Simulate authentication
    if (username === 'admin' && password === 'password123') {
        res.json({
            status: 'success',
            message: 'Login successful',
            // Send data over HTTP
            userData: {
                id: 1,
                role: 'admin',
                apiKey: 'FAKE_API_KEY_1234567890',
                sessionToken: 'FAKE_SESSION_TOKEN_1234567890'
            }
        });
    } else {
        res.status(401).json({
            status: 'error',
            message: 'Invalid credentials'
        });
    }
});

app.listen(80, () => {
    console.log('Server running on http://localhost:80');
}); 