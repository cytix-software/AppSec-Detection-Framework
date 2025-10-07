const express = require('express');
const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Test 48</title>
        </head>
        <body>
            <h1>Test 48</h1>
            <p>Please enter your transfer details below:</p>
            
            <form method="post">
                <input type="hidden" name="action" value="transfer">
                
                <div>
                    <label for="amount">Amount ($):</label>
                    <input type="number" id="amount" name="amount" min="1" required>
                </div>
                
                <div>
                    <label for="recipient">Recipient:</label>
                    <input type="text" id="recipient" name="recipient" required>
                </div>
                
                <button type="submit">Transfer Money</button>
            </form>
        </body>
        </html>
    `);
});

app.post('/', (req, res) => {
    if (req.body.action === 'transfer') {
        const amount = req.body.amount || 0;
        const recipient = req.body.recipient || '';

        // In a real application, this would transfer money
        res.send(`Successfully transferred $${amount} to ${recipient}`);
    }
});

app.listen(port, () => {
  console.log(`Test 48 v2 server running on port ${port}`);
});
