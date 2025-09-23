const express = require('express');
const path = require('path');
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/', (req, res) => {
    res.send(req.body.input);
});

app.listen(port, () => {
    console.log('Test 4 V2 App listening on ' + port);
});