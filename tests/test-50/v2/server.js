const express = require('express');
const cors = require('cors');
const app = express();
const port = 80;

// Insecure CORS configuration
const corsOptions = {
  origin: '*',
  credentials: true
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    const sensitiveData = {
        'user_id': '12345',
        'email': 'user@example.com',
        'role': 'admin'
    };
    res.json(sensitiveData);
});

app.listen(port, () => {
  console.log(`Test 50 v2 server running on port ${port}`);
});
