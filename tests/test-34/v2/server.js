const express = require('express');

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Test 34</title>
  </head>
  <body>
      <h1>Test 34</h1>
      <form method="post" action="/">
          <label for="username">Username:</label><br>
          <input type="text" id="username" name="username" required><br><br>
          <label for="password">Password:</label><br>
          <input type="password" id="password" name="password" required><br><br>
          <input type="submit" value="Register">
      </form>
  </body>
  </html>`);
});

app.post('/', (req, res) => {
  const username = (req.body.username || '').trim();
  const password = (req.body.password || '').trim();
  const data = `Username: ${username}, Password: ${password}\n`;
  res.send('New user registered successfully.');
});

app.listen(port, () => {
  console.log(`Test 34 v2 server running on port ${port}`);
});


