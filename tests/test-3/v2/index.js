const express = require('express');
const path = require('path');
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.post('/change/email', (req, res) => {
    const email = req.body.email;
    res.send(`Successfully changed your account email to ${email}.`);
})

app.listen(port, () => {
  console.log(`Test 3 V2 server running on port ${port}`);
}); 
