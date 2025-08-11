<?php
//CWE-639: Authorization Bypass Through User-Controlled Key &
//CWE-566: Authorization Bypass Through User-Controlled SQL Primary Key


$pdo = new PDO('sqlite:' . __DIR__ . '/invoices.db');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

// Create table and seed data if not exists
$pdo->exec('CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    description TEXT NOT NULL
)');
if ($pdo->query('SELECT COUNT(*) FROM invoices')->fetchColumn() == 0) {
    $pdo->exec("INSERT INTO invoices (user_id, amount, description) VALUES
        (1, 100.00, 'Web design services'),
        (2, 250.00, 'Consulting'),
        (1, 75.50, 'Hosting'),
        (3, 500.00, 'Software license')");
}

$invoice_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

// Vulnerable: No check if invoice belongs to the current user!
$stmt = $pdo->prepare("SELECT * FROM invoices WHERE id = :id");
$stmt->execute(['id' => $invoice_id]);
$invoice = $stmt->fetch();

?>
<!DOCTYPE html>
<html>
<head>
    <title>CWE-566 & 639: Authorization Bypass Through User-Controlled Key</title>
</head>
<body>
    <h1>CWE-566 & 639: Authorization Bypass Through User-Controlled Key</h1>
    <h2>Select an invoice from numbers 1 to 4</h2>
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