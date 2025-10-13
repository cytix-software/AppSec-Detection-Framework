const express = require('express');
const app = express();
const port = 80;

app.get('/', (req, res) => {
    // Set aggressive caching headers
    res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
    res.setHeader('Expires', new Date(Date.now() + 31536000000).toUTCString()); // Expires in 1 year
    res.setHeader('Pragma', 'public'); // Explicitly allow caching

    const sensitiveData = {
        status: 'success',
        user: {
            id: 1,
            username: 'admin',
            role: 'administrator',
            apiKey: 'FAKE_API_KEY_1234567890'
        },
        sensitiveData: {
            accountNumber: '1234567890',
            balance: 10000.00,
            lastTransaction: '2024-03-20T10:00:00Z',
            creditCard: {
                number: '4111111111111111',
                expiry: '12/25',
                cvv: '123'
            }
        }
    };

    res.json(sensitiveData);
});

app.listen(port, () => {
  console.log(`Test 53 v2 server running on port ${port}`);
});
