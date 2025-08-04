<!DOCTYPE html>
<html>
<head>
    <title>Test 35</title>
</head>
<body>
<?php
if (isset($_COOKIE['authenticated']) && $_COOKIE['authenticated'] === 'true') {
    echo "<h1>Welcome, authenticated user!</h1>";
    echo "<p>Super secret data: I AM A STEGOSAURUS!</p>";
} else {
    echo "<h1>Access Denied!</h1>";
    echo "<p>You are not authorized to view this page.</p>";
}
?>
</body>
</html>
