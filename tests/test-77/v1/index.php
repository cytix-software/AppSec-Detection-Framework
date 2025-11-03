<?php
// Usage: http://localhost:8080/invoice.php?id=1

$host = 'localhost';
$db   = 'testdb';
$user = 'testuser';
$pass = 'testpass';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

$invoice_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

$stmt = $pdo->prepare("SELECT * FROM invoices WHERE id = :id");
$stmt->execute(['id' => $invoice_id]);
$invoice = $stmt->fetch();

?>
<!DOCTYPE html>
<html>
<head>
    <title>Test 77</title>
</head>
<body>
    <h1>Invoice Lookup</h1>
    <form method="get">
        <label for="id">Invoice ID:</label>
        <input type="number" name="id" id="id" value="<?php echo htmlspecialchars($invoice_id); ?>">
        <button type="submit">View</button>
    </form>
    <?php if ($invoice): ?>
        <h2>Invoice #<?php echo htmlspecialchars($invoice['id']); ?></h2>
        <pre><?php print_r($invoice); ?></pre>
    <?php elseif ($invoice_id): ?>
        <p>No invoice found for ID <?php echo htmlspecialchars($invoice_id); ?>.</p>
    <?php endif; ?>
</body>
</html>