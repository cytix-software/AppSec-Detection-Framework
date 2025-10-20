
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <form action="" method="post">
            <input type="text" name="input" id="input">
            <input type="submit" value="Submit">
        </form>
    `);
});

app.post('/', (req, res) => {
    const userInput = req.body.input || '';
    exec(`echo ${userInput}`, (err, stdout, stderr) => {
        if (err) {
            res.status(500).send(`Error executing command: ${err.message}`);
            return;
        }
        res.send(`
            <form action="" method="post">
                <input type="text" name="input" id="input">
                <input type="submit" value="Submit">
            </form>
            <pre>${stdout}</pre>
        `);
    });
});

app.listen(port, () => {
    console.log(`Test 63 v2 server running on port ${port}`);
});
