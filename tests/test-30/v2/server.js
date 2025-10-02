const express = require('express');

const app = express();
const port = 80;

class User {
  constructor(data) {
    Object.keys(data).forEach((key) => {
      this[key] = data[key];
    });
    this.isAdmin = this.isAdmin || false; // internal attribute
  }
}

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html>
  <head>
      <title>Test 30</title>
  </head>
  <body>
      <h1>Test 30</h1>
      <h2>Create User</h2>
      <form method="POST">
          <label>Username: <input type="text" name="username" required></label><br>
          <label>Email: <input type="email" name="email" required></label><br>
          <label>Password: <input type="password" name="password" required></label><br>
          <input type="submit" value="Create User">
      </form>
  </body>
  </html>`);
});

app.post('/', (req, res) => {
  const userData = req.body;
  const user = new User(userData);
  res.send(
    'User Created: <br>' +
    'Username: ' + escapeHtml(user.username) + '<br>' +
    'Email: ' + escapeHtml(user.email) + '<br>' +
    'Admin Status: ' + (user.isAdmin ? 'Yes' : 'No') + '<br>'
  );
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
  console.log(`Test 30 v2 server running on port ${port}`);
});


