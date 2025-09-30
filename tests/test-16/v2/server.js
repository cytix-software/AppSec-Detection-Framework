const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.send(`
  <form action="/" method="post">
   Enter URL to download HTML: <br/><input type="text" name="name" id="name">
   <input type="submit" value="Submit">
  </form>
  `);
});

app.post('/', (req, res) => {
  const name = req.body.name || '';
  exec(`curl ${name}`, { timeout: 12000 }, (error, stdout = '', stderr = '') => {
    const escape = (s) => String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
    if (error) {
      return res.status(500).send(`<pre>${escape(stderr || error.message)}</pre>`);
    }
    const body = escape(stdout);
    res.send(body);
  });
});

app.listen(port, () => {
  console.log(`Test 16 v2 server running on port ${port}`);
});


