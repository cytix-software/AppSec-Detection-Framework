
const express = require('express');
const { exec } = require('child_process');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
    const command = 'ps aux | grep node';

    exec(command, (err, stdout, stderr) => {
        if (err) {
            res.status(500).send(`Error executing command: ${err.message}`);
            return;
        }

        res.send(`
            <h1>Test 62</h1>
            <h2>System Process Information</h2>
            <pre>${stdout}</pre>
        `);
    });
});

app.listen(port, () => {
    console.log(`Test 62 v2 server running on port ${port}`);
});
