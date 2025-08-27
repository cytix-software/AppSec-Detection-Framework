<?php
$logFile = isset($_POST['logfile']) ? $_POST['logfile'] : '/tmp/app.log';

if (isset($_POST['message'])) {
    $msg = $_POST['message'];
    file_put_contents($logFile, $msg . "\n", FILE_APPEND);
    echo "<p>Logged to $logFile</p>";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Log File Demo</title>
</head>
<body>
    <h2>Set Log File Path</h2>
    <form method="post">
        <input type="text" name="logfile" value="<?php echo htmlspecialchars($logFile); ?>" placeholder="/tmp/app.log" />
        <button type="submit">Set Log File</button>
    </form>
    <h2>Submit Log Message</h2>
    <form method="post">
        <input type="hidden" name="logfile" value="<?php echo htmlspecialchars($logFile); ?>" />
        <input name="message" placeholder="Log message" />
        <button type="submit">Log</button>
    </form>
    <p>Current log file: <b><?php echo htmlspecialchars($logFile); ?></b></p>
</body>
</html>
