const express = require('express');
const xpath = require('xpath');
const dom = require('xmldom').DOMParser;

const app = express();
const port = 80;

app.use(express.urlencoded({ extended: true }));

const xml_data = `<?xml version="1.0" encoding="UTF-8"?>
<users>
    <user>
        <username>admin</username>
        <email>admin@example.com</email>
        <department>IT</department>
    </user>
    <user>
        <username>john</username>
        <email>john@example.com</email>
        <department>HR</department>
    </user>
    <user>
        <username>jane</username>
        <email>jane@example.com</email>
        <department>Finance</department>
    </user>
    <user>
        <username>bob</username>
        <email>bob@example.com</email>
        <department>Marketing</department>
    </user>
    <user>
        <username>alice</username>
        <email>alice@example.com</email>
        <department>Sales</department>
    </user>
</users>`;

app.get('/', (req, res) => {
    res.send(`
        <h1>Test 71 v2</h1>
        <h2>Search Users (name is inserted into an XPath query)</h2>
        <form method="post">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" placeholder="Enter username">
            <button type="submit">Search</button>
        </form>
    `);
});

app.post('/', (req, res) => {
    let resultsHtml = '';
    if (req.body.username) {
        const username = req.body.username;
        const doc = new dom().parseFromString(xml_data);

        // Vulnerable XPath query
        const query = `//user[username='${username}']`;

        try {
            const nodes = xpath.select(query, doc);
            resultsHtml = '<h3>Search Results:</h3>';
            if (nodes.length > 0) {
                resultsHtml += `<p>Found ${nodes.length} users</p>`;
                resultsHtml += '<table border="1"><tr><th>Username</th><th>Email</th><th>Department</th></tr>';
                nodes.forEach(node => {
                    const user = {
                        username: xpath.select1("username/text()", node).nodeValue,
                        email: xpath.select1("email/text()", node).nodeValue,
                        department: xpath.select1("department/text()", node).nodeValue
                    };
                    resultsHtml += `<tr><td>${user.username}</td><td>${user.email}</td><td>${user.department}</td></tr>`;
                });
                resultsHtml += '</table>';
            } else {
                resultsHtml += '<p>No users found.</p>';
            }
        } catch (e) {
            resultsHtml = '<p>Error executing XPath query.</p>';
        }
    }

    res.send(`
        <h1>Test 71 v2</h1>
        <h2>Search Users (XPath Injection)</h2>
        <form method="post">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" value="${req.body.username || ''}" placeholder="Enter username">
            <button type="submit">Search</button>
        </form>
        ${resultsHtml}
    `);
});

app.listen(port, () => {
    console.log(`Test 71 v2 server running on port ${port}`);
});