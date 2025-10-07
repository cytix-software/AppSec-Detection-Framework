const express = require('express');
const fs = require('fs');
const app = express();
const port = 80;

const logFile = 'debug.log';

app.get('/', (req, res) => {
    // Simulate user data
    const userData = {
        id: 1,
        username: 'admin',
        apiKey: 'FAKE_API_KEY_1234567890',
        creditCard: {
            number: '4111111111111111',
            expiry: '12/25',
            cvv: '123'
        }
    };

    // Add random transaction data
    userData.transaction = {
        id: 'TX' + Math.floor(Math.random() * 900000) + 100000,
        amount: Math.floor(Math.random() * 991) + 10,
        timestamp: new Date().toISOString(),
        status: 'completed'
    };

    // Store data in a log file
    const logEntry = JSON.stringify(userData, null, 2) + "\n---\n";
    fs.appendFileSync(logFile, logEntry);

    // Read the last few entries to display
    const logContent = fs.existsSync(logFile) ? fs.readFileSync(logFile, 'utf8') : '';
    const entries = logContent.split('---').filter(Boolean);
    const lastEntries = entries.slice(-5);

    let body = `
        <h1>Test 55</h1>
        <p>New transaction data has been automatically stored in the log file.</p>
        <h2>Recent Log Entries:</h2>
    `;

    lastEntries.forEach(entry => {
        body += `<pre>${entry.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>`;
    });

    res.send(body);
});

app.listen(port, () => {
  console.log(`Test 55 v2 server running on port ${port}`);
});

