const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const port = 80;

app.use(cookieParser());

function getRole(user) {
  return 'Guest';
}

function showLoginScreen(res) {
  res.send('Please log in to access this resource.');
}

app.get('/', (req, res) => {
  let role = req.cookies && req.cookies.role;

  if (!role) {
    role = getRole('user');
    if (role) {
      res.cookie('role', role, { maxAge: 1000 * 60 * 60 * 2 });
    } else {
      return showLoginScreen(res);
    }
  }

  if (role === 'Reader') {
    res.send('This is a confidential record.');
  } else {
    res.status(403).send('You are not authorized to view this record.');
  }
});

app.listen(port, () => {
  console.log(`Test 14 v2 server running on port ${port}`);
});


