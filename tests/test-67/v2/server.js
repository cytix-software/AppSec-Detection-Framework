const express = require('express');
const app = express();
const port = 80;

app.get('/', (req, res) => {
    const code = req.query.code;
    if (code) {
        try {
            const result = eval(code);
            res.send(`Result: ${result}`);
        } catch (error) {
            res.status(400).send(`Error: ${error.message}`);
        }
    } else {
        res.send('Provide code to evaluate with the "code" query parameter.');
    }
});

app.listen(port, () => {
    console.log(`Test 67 v2 server running on port ${port}`);
});
