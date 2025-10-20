
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

function preventXSS(input, mask) {
    return input.replace(/script/g, mask);
}

app.get('/', (req, res) => {
    res.send(`
        <h1>Test 65</h1>
        <form action="" method="post">
            <input type="text" name="input" id="input" placeholder="Try: SCRIPT, Script, or script">
            <input type="submit" value="Submit">
        </form>
    `);
});

app.post('/', (req, res) => {
    const userInput = req.body.input || '';
    const filteredInput = preventXSS(userInput, "BLOCKED");
    res.send(`
        <h1>Test 65</h1>
        <form action="" method="post">
            <input type="text" name="input" id="input" placeholder="Try: SCRIPT, Script, or script">
            <input type="submit" value="Submit">
        </form>
        <div>${filteredInput}</div>
    `);
});

app.listen(port, () => {
    console.log(`Test 65 v2 server running on port ${port}`);
});
