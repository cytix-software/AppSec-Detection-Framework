<!-- Simple web proxy: fetches and returns the content of any user-supplied URL -->
<!DOCTYPE html>
<html>
<head>
    <title>CWE-441: Unintended Proxy Example</title>
</head>
<body>
    <h1>CWE-441: Unintended Proxy or Intermediary</h1>
    <form method="post">
        <label for="url">Enter URL to fetch:</label>
        <input type="text" id="url" name="url" size="50" placeholder="http://example.com">
        <button type="submit">Fetch</button>
    </form>
    <hr>
    <?php
    // Takes user inputted URL and fetches its content, acting as a simple proxy.
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['url'])) {
        $url = $_POST['url'];
        $content = @file_get_contents($url);
        // print response or error
        if ($content === false) {
            echo "<p style='color:red'>Failed to fetch content from: " . htmlspecialchars($url) . "</p>";
        } else {
            echo "<h2>Fetched Content:</h2>";
            echo "<pre style='white-space: pre-wrap; word-break: break-all; background: #f8f8f8; border: 1px solid #ccc; padding: 10px;'>";
            echo htmlspecialchars($content);
            echo "</pre>";
        }
    }
    ?>
</body>
</html>