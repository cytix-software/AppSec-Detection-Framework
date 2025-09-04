<?php
// This app generates reports

$user = isset($_GET['user']) ? preg_replace('/[^a-zA-Z0-9]/', '', $_GET['user']) : 'guest';
$reportDir = __DIR__ . '/reports';
$reportFile = "$reportDir/report_$user.txt";

if (!is_dir($reportDir)) {
    mkdir($reportDir, 0777, true);
}

if (isset($_GET['generate'])) {
    // Simulate generating a sensitive report
    file_put_contents($reportFile, "Sensitive report for user $user\nSecret: 12345");
    echo "Report generated! <a href='?download=1&user=$user'>Download here</a><br>";
    echo "(File remains accessible at /tests/test-78/v1/reports/report_$user.txt)";
    exit;
}

if (isset($_GET['download'])) {
    if (file_exists($reportFile)) {
        header('Content-Type: text/plain');
        header('Content-Disposition: attachment; filename="report.txt"');
        readfile($reportFile);
        exit;
    } else {
        echo "No report found.";
        exit;
    }
}

// Main page
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test 78</title>
</head>
<body>
<h2>Test 78</h2>
<form method="get">
    <input type="hidden" name="user" value="<?= htmlspecialchars($user) ?>">
    <button type="submit" name="generate" value="1">Generate Report</button>
</form>
<p>After generating the report, it remains accessible.</p>
</body>
</html>
