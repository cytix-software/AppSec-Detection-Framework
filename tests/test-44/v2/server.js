const express = require('express');
const path = require('path');
const app = express();
const port = 80;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint that returns user input 
app.get('/api/search', (req, res) => {
  const query = req.query.text || '';
  res.status(200).send(query);
});

app.listen(port, () => {
  console.log(`Test 44 v2 server running on port ${port}`);
}); 