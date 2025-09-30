const express = require('express');
const path = require('path');

const app = express();
const port = 80;

app.get('/header', (req, res) => {
  const val = req.query.val || '';
  res.setHeader('X-Custom-Header', val);
  res.send('Header set');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Test 18 v2 server running on port ${port}`);
});


