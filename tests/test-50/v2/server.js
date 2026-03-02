const express = require('express');
const cors = require('cors');

const app = express();
const port = 80;

app.use(cors({
  origin: true, // reflect Origin
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.options('*', cors({
  origin: true,
  credentials: true,
}));

app.use((req, res, next) => {
  res.setHeader('Vary', 'Origin');
  next();
});

app.get('/', (req, res) => {
  res.json({
    user_id: '12345',
    email: 'user@example.com',
    role: 'admin'
  });
});

app.listen(port, () => console.log(`Test 50 v2 server running on port ${port}`));