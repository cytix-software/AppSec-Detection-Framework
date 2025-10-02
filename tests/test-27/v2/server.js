const express = require('express');

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Test 27</title>
  </head>
  <body>
      <h1>Send a Message</h1>
      <form method="post">
          <label for="message">Enter your message:</label>
          <input type="text" name="message" id="message" required>
          <button type="submit">Send</button>
      </form>
  </body>
  </html>`);
});

app.post('/', (req, res) => {
  const message = req.body.message || '';
  res.send(`<h2>Received Message:</h2><p>${escapeHtml(message)}</p>`);
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

app.listen(port, () => {
  console.log(`Test 27 v2 server running on port ${port}`);
});


