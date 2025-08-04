<?php
// Vulnerable to CWE-601: URL Redirection to Untrusted Site
// This application redirects users to any URL without validation

// Get the redirect URL from the query parameter
$redirect_url = isset($_GET['url']) ? $_GET['url'] : '';

// If no URL is provided, show the redirect form
if (empty($redirect_url)) {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Open Redirect Test</title>
    </head>
    <body>
        <h1>Open Redirect Vulnerability Test</h1>
        <p>Enter any URL to redirect to:</p>
        <form action="index.php" method="GET">
            <input type="text" name="url" placeholder="Enter URL to redirect to" required><br><br>
            <button type="submit">Redirect</button>
        </form>
        <p>Example: Try redirecting to <a href="index.php?url=https://example.com">https://example.com</a></p>
    </body>
    </html>
    <?php
    exit;
}

// Vulnerable code: Directly redirects to any URL without validation
header("Location: " . $redirect_url);
exit;
?> 