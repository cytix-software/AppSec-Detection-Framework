const express = require('express');
const session = require('express-session');

const app = express();
const port = 80;

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

app.get('/', (req, res) => {
  if (req.query.username) {
    req.session.user = req.query.username;
  }

  const user = req.session.user;
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Test 19</title>
  </head>
  <body>
      <h1>Test 19</h1>
      ${user ? `<p>Logged in as: ${escapeHtml(user)}</p>` : `<p>Please provide your username:</p>
      <form method="get">
          <input type="text" name="username">
          <button type="submit">Login</button>
      </form>`}
  </body>
  </html>`);
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
  console.log(`Test 19 v2 server running on port ${port}`);
});


