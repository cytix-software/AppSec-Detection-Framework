<?php
// Get the redirect URL from the query parameter
$redirect_url = isset($_GET['url']) ? $_GET['url'] : '';

// If no URL is provided, show the redirect form
if (empty($redirect_url)) {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Test 54</title>
    </head>
    <body>
        <h1>Test 54</h1>
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

// Directly redirects to any URL
header("Location: " . $redirect_url);
exit;
?>