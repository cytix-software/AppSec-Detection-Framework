const express = require('express');
const crypto = require('crypto');
const app = express();
const port = 80;

app.get('/', (req, res) => {
    const UUID = crypto.randomUUID()
    const date = new Date();
    date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000));

    res.cookie('sessionID', UUID, {
        expires: date,
        path: '/',
        sameSite: 'Lax',
        httpOnly: false
    });
    res.send('Hello, the session ID has been set within a secure cookie.')
});

app.listen(port, () => {
    console.log('Test 8 V2 App listening on ' + port);    
});