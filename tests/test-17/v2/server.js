const express = require('express');
const crypto = require('crypto');

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: false }));

function checkPassword(inputPassword) {
  const salt = '12345';
  const hashedInput = crypto.createHash('sha1').update(salt + inputPassword).digest('hex');
  return hashedInput === '126d2388a03203a8c9c83b5a6af3b85426b85720';
}

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login System</title>
  </head>
  <body>
      <h1>Login</h1>
      <form method="POST" action="/login">
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required>
          <button type="submit">Login</button>
      </form>
  </body>
  </html>`);
});

app.post('/login', (req, res) => {
  const password = req.body.password || '';
  if (checkPassword(password)) {
    res.send('Login successful!');
  } else {
    res.send('Invalid password.');
  }
});

app.listen(port, () => {
  console.log(`Test 17 v2 server running on port ${port}`);
});


