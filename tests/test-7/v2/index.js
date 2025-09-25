const express = require('express');
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));

function reviver(key, value) {
    if (key === 'inject' && typeof value === 'string') {
        eval(value); 
        return;
    }
    return value;
}

app.get('/', (req, res) => {
    const html = `
    <form action="/deserialize" method="post">
        <input type="text" name="input" value="ewogICAgImV4YW1wbGUiOiAiQSBzYWZlIHByb3BlcnR5IiwKICAgICJpbmplY3QiOiAicmVxdWlyZSgnY2hpbGRfcHJvY2VzcycpLmV4ZWMoJ2lkJywgKGUscyxyKT0+Y29uc29sZS5sb2coJ1JDRTogJyArIHMpKSIKfQ===" id="input">
        <input type="submit" value="Submit">
    </form>
    `
    res.send(html);
});

app.post('/deserialize', (req, res) => {
    const base64Input = req.body.input;
    
    if (!base64Input) {
        return res.status(400).send("No input provided.");
    }
    
    try {
        const jsonString = Buffer.from(base64Input, 'base64').toString('utf8');
        
        // Deserialize with a reviver
        const output = JSON.parse(jsonString, reviver);

        // Return a harmless part of the object structure
        res.send(`Deserialization successful. Output: ${JSON.stringify(output)}`);

    } catch (e) {
        console.error("Deserialization error:", e);
        res.status(500).send("Error processing data.");
    }
});

app.listen(port, () => {
    console.log('Test 7 V2 App listening on ' + port);
});