const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = 80;

app.use(cookieParser());

app.get('/', (req, res) => {
  if (req.cookies && req.cookies.authenticated === 'true') {
    res.send('<h1>Welcome, authenticated user!</h1><p>Super secret data: I AM A STEGOSAURUS!</p>');
  } else {
    res.send('<h1>Access Denied!</h1><p>You are not authorized to view this page.</p>');
  }
});

app.listen(port, () => {
  console.log(`Test 35 v2 server running on port ${port}`);
});


