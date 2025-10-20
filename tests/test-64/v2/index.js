
const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <h1>Directory Lister</h1>
        <form method="post">
            <label for="filename">Enter a filename or directory to list:</label>
            <input type="text" id="filename" name="filename">
            <button type="submit">List</button>
        </form>
        <p style="color:orange;">Note: User input is passed directly as a command argument.</p>
    `);
});

app.post('/', (req, res) => {
    const filename = req.body.filename || '';
    const command = `ls -l ${filename}`;

    exec(command, (err, stdout, stderr) => {
        let output = '';
        if (err) {
            output = err.message;
        } else {
            output = stdout;
        }

        res.send(`
            <h1>Directory Lister</h1>
            <form method="post">
                <label for="filename">Enter a filename or directory to list:</label>
                <input type="text" id="filename" name="filename">
                <button type="submit">List</button>
            </form>
            <pre>${output}</pre>
            <p style="color:orange;">Note: User input is passed directly as a command argument.</p>
        `);
    });
});

app.listen(port, () => {
    console.log(`Test 64 v2 server running on port ${port}`);
});
