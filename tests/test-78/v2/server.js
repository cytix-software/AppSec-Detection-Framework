const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 80;

// Serve static files from the 'public' directory
app.use(express.static('public'));

const reportDir = path.join(__dirname, 'public', 'reports');

// Ensure the reports directory exists
if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
}

app.get('/', (req, res) => {
    const user = req.query.user ? String(req.query.user).replace(/[^a-zA-Z0-9]/g, '') : 'guest';
    const reportFile = `report_${user}.txt`;
    const reportFilePath = path.join(reportDir, reportFile);
    const reportUrl = `/reports/${reportFile}`;

    if (req.query.generate) {
        const reportContent = `Sensitive report for user ${user}\nSecret: 12345\nTimestamp: ${new Date().toISOString()}`;
        fs.writeFileSync(reportFilePath, reportContent);
        res.send(
            `
            <h1>Test 78</h1>
            <p>Report generated for user <b>${user}</b>!</p>
            <a href="${reportUrl}" download="report.txt">Download Here</a><br>
            <p>(File also remains accessible at <a href="${reportUrl}" target="_blank">${reportUrl}</a>)</p>
            <br>
            <a href="/">Back</a>
        `
        );
    } else {
        res.send(
            `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Test 78</title>
            </head>
            <body>
                <h2>Test 78: Improper Cleanup on File Creation</h2>
                <p>This test generates a sensitive report and saves it to a publicly accessible directory.</p>
                <p>The vulnerability is that the file is never deleted, allowing anyone who can guess the filename to access it.</p>
                <form method="get">
                    <label for="user">Username:</label>
                    <input type="text" name="user" id="user" value="${user}">
                    <button type="submit" name="generate" value="1">Generate Report</button>
                </form>
                <p>Try generating a report for one user (e.g., 'alice') and then accessing another user's report directly (e.g., by navigating to /reports/report_bob.txt after creating one for 'bob').</p>
            </body>
            </html>
        `
        );
    }
});

app.listen(port, () => {
    console.log(`Test 78 v2 server running on port ${port}`);
});
