const express = require('express');
const session = require('express-session');

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html>
  <head>
      <title>Test 23</title>
  </head>
  <body>
      <h1>Test 23</h1>
      <h2>Login</h2>
      <form method=\"POST\" action=\"/login\"> 
          <label>Username: <input type=\"text\" name=\"username\"></label><br>
          <label>Password: <input type=\"password\" name=\"password\"></label><br>
          <input type=\"submit\" value=\"Login\">
      </form>
  </body>
  </html>`);
});

app.post('/login', (req, res) => {
  const username = req.body.username || '';
  req.session.user = username;
  res.send(`<p>Logged in as: ${escapeHtml(username)}</p>`);
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
  console.log(`Test 23 v2 server running on port ${port}`);
});


