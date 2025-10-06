const express = require('express');

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html>
  <head>
      <title>Test 33</title>
  </head>
  <body>
      <h1>Test 33</h1>
      <form action="/change" method="GET">
          <label for="user">Username:</label>
          <input type="text" id="user" name="user" required><br><br>

          <label for="pass">New Password:</label>
          <input type="password" id="pass" name="pass" required><br><br>

          <label for="checkpass">Confirm Password:</label>
          <input type="password" id="checkpass" name="checkpass" required><br><br>
          
          <input type="submit" value="Change Password">
      </form>
  </body>
  </html>`);
});

app.get('/change', (req, res) => {
  const user = req.query.user || '';
  const pass = req.query.pass || '';
  const checkpass = req.query.checkpass || '';
  if (pass === checkpass) {
    res.send(`<h3>Password for user ${escapeHtml(user)} has been changed to ${escapeHtml(pass)}.</h3>`);
  } else {
    res.send('<h3>Passwords do not match!</h3>');
  }
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
  console.log(`Test 33 v2 server running on port ${port}`);
});


