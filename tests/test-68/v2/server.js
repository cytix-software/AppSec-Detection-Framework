const express = require('express');
const SSI = require('ssi');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 80;

const baseDir = __dirname;

const ssiEngine = new SSI({
  baseDir,
  ext: '.shtml',
  encoding: 'utf-8',
});

fs.writeFileSync(path.join(__dirname, 'include.txt'), 'This is the default included file.');

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.shtml');

  const fileContent = `
<html>
  <body>
    <h1>Test</h1>
    <!--#include file="${req.query.file || 'include.txt'}" -->
  </body>
</html>
`.trim();

  fs.writeFileSync(filePath, fileContent);

  const raw = fs.readFileSync(filePath, 'utf8');
  const output = ssiEngine.compile(raw, filePath);

  res.type('html').send(output);
});

app.listen(port, () => console.log(`Test 68 v2 server running on port ${port}`));