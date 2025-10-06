const express = require('express');

const app = express();
const port = 80;

const users = {
  Desmond: {
    email: 'desmond@themoon.com',
    password: 'password123',
    security_question: 'What is your favorite color?',
    security_answer: 'blue'
  }
};

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>Password Recovery</title>
  </head>
  <body>
      <h1>Password Recovery</h1>
      <form method="post" action="/recover">
          <label for="username">Username:</label><br>
          <input type="text" id="username" name="username" required><br><br>

          <label for="email">Email:</label><br>
          <input type="email" id="email" name="email" required><br><br>

          <label for="security_answer">Security Question: What is your favorite color?</label><br>
          <input type="text" id="security_answer" name="security_answer" required><br><br>

          <input type="submit" name="recover" value="Recover Password">
      </form>
  </body>
  </html>`);
});

app.post('/recover', (req, res) => {
  const username = (req.body.username || '').trim();
  const email = (req.body.email || '').trim();
  const security_answer = (req.body.security_answer || '').trim().toLowerCase();
  if (users[username]) {
    const user = users[username];
    if (user.email === email && user.security_answer.toLowerCase() === security_answer) {
      return res.send(`<p>Password recovery successful! Your password is: <strong>${escapeHtml(user.password)}</strong></p>`);
    }
    return res.send('<p>Error: Invalid email or security answer provided.</p>');
  }
  res.send('<p>Error: User not found.</p>');
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
  console.log(`Test 32 v2 server running on port ${port}`);
});


