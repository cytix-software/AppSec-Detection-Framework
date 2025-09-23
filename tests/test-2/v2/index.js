const express = require('express');
const path = require('path');
const { exec } = require("child_process");
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.get('/products', (req, res) =>{
    const product_id = req.query.id;

    exec(`echo ${product_id}`, (error, stdout, stderr) => {
        if (error) {
            res.status(500).send(`Server Error: ${error.message}`);
            return;
        }
        if (stderr) {
            res.status(500).send(`Command Error: ${stderr}`);
            return;
        }
        console.log(`product ID = ${product_id}`);
        res.status(200).send(`Output: ${stdout}`);
    });
})

app.listen(port, () => {
  console.log(`Test 2 v2 server running on port ${port}`);
}); 