<?php
// CWE-613: Insufficient Session Expiration.
ini_set('session.gc_maxlifetime', 2147483647);  
ini_set('session.cookie_lifetime', 2147483647); 

session_start();

if (isset($_GET['username'])) {
    $username = $_GET['username'];
    
    // CWE-501: Trust boundary violation - Untrusted input is directly stored in the session
    if (!isset($_SESSION['user'])) {
        // CWE-384: Session Fixation - Existing session identifier is not invalidated.
        // CWE-287: Improper Authentication.
        $_SESSION['user'] = $username; 
    }
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test 19</title>
</head>
<body>
    <h1>Welcome</h1>
    <?php if (isset($_SESSION['user'])): ?>
        <!--CWE-79: Improper neutralisation of input during web page generation.-->
        <p>Hello, <?php echo htmlspecialchars($_SESSION['user']); ?>!</p>
    <?php else: ?>
        <p>Please provide your username:</p>
        <form method="get">
            <input type="text" name="username">
            <button type="submit">Login</button>
        </form>
    <?php endif; ?>
</body>
</html>