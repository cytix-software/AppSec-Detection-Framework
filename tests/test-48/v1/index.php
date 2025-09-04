<?php
// Simulated sensitive action
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'transfer') {
    $amount = isset($_POST['amount']) ? (int)$_POST['amount'] : 0;
    $recipient = isset($_POST['recipient']) ? $_POST['recipient'] : '';
    
    // In a real application, this would transfer money
    echo "Successfully transferred $" . htmlspecialchars($amount) . " to " . htmlspecialchars($recipient);
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test 48</title>
</head>
<body>
    <h1>Test 48</h1>
    <p>Please enter your transfer details below:</p>
    
    <form method="post">
        <input type="hidden" name="action" value="transfer">
        
        <div>
            <label for="amount">Amount ($):</label>
            <input type="number" id="amount" name="amount" min="1" required>
        </div>
        
        <div>
            <label for="recipient">Recipient:</label>
            <input type="text" id="recipient" name="recipient" required>
        </div>
        
        <button type="submit">Transfer Money</button>
    </form>
</body>
</html>