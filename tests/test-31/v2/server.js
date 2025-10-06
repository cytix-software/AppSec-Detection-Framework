const express = require('express');
const session = require('express-session');

const app = express();
const port = 80;

app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

app.get('/', (req, res) => {
  if (!req.session.users) {
    req.session.users = { 1: 'Alice', 2: 'Bob', 3: 'Charlie' };
  }
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Test 31</title>
  </head>
  <body>
      <h1>Test 31</h1>
      <form method="GET" action="/delete">
          <label for="userID">Enter User ID to delete:</label>
          <input type="number" id="userID" name="userID" required>
          <button type="submit">Delete</button>
      </form>
  </body>
  </html>`);
});

app.get('/delete', (req, res) => {
  const id = parseInt(req.query.userID, 10);
  if (!req.session.users) {
    req.session.users = { 1: 'Alice', 2: 'Bob', 3: 'Charlie' };
  }
  if (req.session.users[id]) {
    delete req.session.users[id];
    res.send(`<p style='color:red;'>User with ID ${id} has been deleted.</p>`);
  } else {
    res.send(`<p style='color:blue;'>No user found with ID ${id}.</p>`);
  }
});

app.listen(port, () => {
  console.log(`Test 31 v2 server running on port ${port}`);
});


