const express = require('express');
const fs = require('fs');
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const html = `
    <form action="" method="post">
        <input type="text" name="input" id="input" value="readme.txt">
        <input type="submit" value="Submit">
    </form>
    `
    res.send(html);
});

app.post('/', (req, res) => {
    const user_input = req.body.input
    const sanitised = user_input.replace(/\.\.\//g, "")
    const filename = "./" + sanitised
    console.log(filename)

    try {
    // Read file synchronously
    const data = fs.readFileSync(filename, 'utf8');
    res.status(200).send('File content:' + data)
    console.log('File content:', data);
    } catch (err) {
    res.status(404).send('File not found!')
    console.error('Error reading file:', err);
    }
});

app.listen(port, () => {
    console.log('Test 9 V2 App listening on ' + port);
});