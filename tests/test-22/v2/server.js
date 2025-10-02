const express = require('express');
const session = require('express-session');

const app = express();
const port = 80;

// Extremely long session lifetime to simulate CWE-613 (Insufficient Session Expiration)
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  rolling: true,
  cookie: { maxAge: 21474836 * 1000 }
}));
app.get('/', (req, res) => {
  req.session.lastSeen = Date.now();
  res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
      <title>Test 22</title>
  </head>
  <body>
      <h1>Test 22</h1>
      <p>Die potato!</p>
  </body>
  </html>`);
});

app.listen(port, () => {
  console.log(`Test 22 v2 server running on port ${port}`);
});


