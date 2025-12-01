const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
const port = 80;

app.use(bodyParser.urlencoded({ extended: true }));

const allowed_commands = ['ls', 'ping', 'cat', 'whoami'];

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test-95</title>
        </head>
        <body>
            <h1>Test-95</h1>
            <form method="post">
                <label for="cmd">Enter command (only ls, ping, cat, or whoami is allowed):</label>
                <input type="text" id="cmd" name="cmd" placeholder="e.g. ls -la /, ping 8.8.8.8">
                <button type="submit">Execute</button>
            </form>
        </body>
        </html>
    `);
});

app.post('/', (req, res) => {
    const cmd = req.body.cmd || '';
    let message = '';
    let allowed = false;

    for (const command of allowed_commands) {
        if (cmd.toLowerCase().includes(command)) {
            allowed = true;
            break;
        }
    }

    if (allowed) {
        exec(cmd, (error, stdout, stderr) => {
            let output = '';
            if (error) {
                output = error.message;
            } else if (stderr) {
                output = stderr;
            } else {
                output = stdout;
            }
            message = `<pre>${output}</pre>`;
            sendResponse(res, cmd, message);
        });
    } else {
        message = `<span style='color:red;'>Command not allowed.</span>`;
        sendResponse(res, cmd, message);
    }
});

function sendResponse(res, cmd, message) {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test-95</title>
        </head>
        <body>
            <h1>Test-95</h1>
            <form method="post">
                <label for="cmd">Enter command (only ls, ping, cat, or whoami is allowed):</label>
                <input type="text" id="cmd" name="cmd" value="${cmd}" placeholder="e.g. ls -la /, ping 8.8.8.8">
                <button type="submit">Execute</button>
            </form>
            ${message}
        </body>
        </html>
    `);
}

app.listen(port, () => {
    console.log(`Test 95 v2 server running on port ${port}`);
});
