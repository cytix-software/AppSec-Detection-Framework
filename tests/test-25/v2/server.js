const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 80;

app.get('/', (req, res) => {
  const moduleName = req.query.module_name;
  if (!moduleName) {
    return res.send('Module name required.');
  }
  try {
    // Directly require a function.js from the specified module directory
    const modPath = path.join(__dirname, moduleName, 'function.js');
    if (!fs.existsSync(modPath)) {
      return res.status(404).send('Module not found.');
    }
    const mod = require(modPath);
    const output = typeof mod === 'function' ? mod() : 'Module loaded';
    res.send(String(output));
  } catch (e) {
    res.status(500).send('Error loading module.');
  }
});

app.listen(port, () => {
  console.log(`Test 25 v2 server running on port ${port}`);
});


