const express = require('express');
const fs = require('fs');

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html>
  <head>
      <title>Test 21</title>
  </head>
  <body>
      <h1>Test 21</h1>
      <h2>Enter a Value</h2>
      <form method="POST" action="/">
          <label for="val">Value:</label>
          <input type="text" id="val" name="val" required>
          <button type="submit">Submit</button>
      </form>
  </body>
  </html>`);
});

app.post('/', (req, res) => {
  const val = req.body.val;
  try {
    if (isNaN(val)) {
      throw new Error('Invalid number');
    }
    const value = parseInt(val, 10);
    res.send(String(value));
  } catch (e) {
    const decoded = decodeURIComponent(val);
    const logEntry = `INFO: Failed to parse val = ${decoded}\n`;
    fs.appendFileSync('app.log', logEntry);
    res.send('Logged error');
  }
});

app.listen(port, () => {
  console.log(`Test 21 v2 server running on port ${port}`);
});


