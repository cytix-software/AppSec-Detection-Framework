const express = require('express');
const session = require('express-session');
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } 
}));

const validToken = "123456";

app.get('/', (req, res) => {
  res.send(`
    <form method="POST">
        <input type="hidden" name="auth_token" value="123456">
        <button type="submit">Login</button>
    </form>
  `);
});

app.post('/', (req, res) => {
  const { auth_token } = req.body;

  if (auth_token === validToken) {
    req.session.authenticated = true;
    res.send('Authentication successful! You are logged in.');
  } else {
    res.send('Authentication failed!');
  }
});

app.listen(port, () => {
  console.log(`Test 37 v2 server running on port ${port}`);
});
