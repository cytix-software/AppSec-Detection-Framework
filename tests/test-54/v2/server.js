const express = require('express');
const app = express();
const port = 80;

app.get('/', (req, res) => {
    const redirectUrl = req.query.url;

    if (redirectUrl) {
        res.redirect(redirectUrl);
    } else {
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Test 54</title>
            </head>
            <body>
                <h1>Test 54</h1>
                <p>Enter any URL to redirect to:</p>
                <form action="/" method="GET">
                    <input type="text" name="url" placeholder="Enter URL to redirect to" required><br><br>
                    <button type="submit">Redirect</button>
                </form>
                <p>Example: Try redirecting to <a href="/?url=https://example.com">https://example.com</a></p>
            </body>
            </html>
        `);
    }
});

app.listen(port, () => {
  console.log(`Test 54 v2 server running on port ${port}`);
});
