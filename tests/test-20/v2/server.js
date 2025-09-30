const express = require('express');
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: false }));

function loginUser(username, password) {
  if (username === 'admin' && password === 'password123') {
    return true;
  } else {
    return false;
  }
}

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html>
  <head>
      <title>Test 20</title>
  </head>
  <body>
      <h1>Test 20</h1>
      <form method="post" action="/login">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username">
          <br>
          <label for="password">Password:</label>
          <input type="password" id="password" name="password">
          <br>
          <button type="submit">Login</button>
      </form>
  </body>
  </html>`);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (loginUser(username, password)) {
    res.send('Login successful. Proceed');
  } else {
    res.send('Login failed. Retry.');
  }
});

app.listen(port, () => {
  console.log(`Test 20 v2 server running on port ${port}`);
});


