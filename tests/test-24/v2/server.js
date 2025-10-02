const express = require('express');
const fs = require('fs');

const app = express();
const port = 80;

const users = {
  admin: 'password123',
  user1: 'mypassword',
  user2: 'securepass',
};

const records = {
  admin: '10 Downing Street, London',
  user1: 'The white house, Washington DC',
  user2: 'Kremlin, Moscow',
};

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html>
  <head>
      <title>Test 24</title>
  </head>
  <body>
      <h1>Test 24</h1>
      <form method="POST">
          Username: <input type="text" name="username"><br>
          Password: <input type="password" name="password"><br>
          <input type="submit" value="Login">
      </form>
  </body>
  </html>`);
});

app.post('/', (req, res) => {
  const username = req.body.username || '';
  const password = req.body.password || '';
  if (users[username] && users[username] === password) {
    const logLine = `User: ${username} | Password: ${password} | Record Data: ${records[username]} | IP: ${req.ip}\n`;
    fs.appendFileSync('user_log.txt', logLine);
    res.send(`<h2>Welcome, ${username}!</h2>`);
  } else {
    res.send("<p style='color:red;'>Invalid credentials</p>");
  }
});

app.listen(port, () => {
  console.log(`Test 24 v2 server running on port ${port}`);
});


