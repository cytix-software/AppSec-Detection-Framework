const express = require('express');
const path = require('path');
const { exec } = require("child_process");
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
    console.log('product ID = ' + req.query.id);
    exec(`echo ${req.query.id}`, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`Output: ${stdout}`);
    });
})

app.listen(port, () => {
  console.log(`Test 2 v2 server running on port ${port}`);
}); 