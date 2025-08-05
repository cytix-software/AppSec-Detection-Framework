<?php
// CWE-471: Modification of Assumed-Immutable Data (MAID)
// This script demonstrates allowing users to modify assumed-immutable data (user_id) to access unauthorized data.

// Simulate user database
$users = [
    1 => ['name' => 'John Doe', 'email' => 'john@example.com', 'balance' => 100.00, 'role' => 'user'],
    2 => ['name' => 'Jane Smith', 'email' => 'jane@example.com', 'balance' => 500.00, 'role' => 'user'],
    3 => ['name' => 'Admin User', 'email' => 'admin@example.com', 'balance' => 9999.99, 'role' => 'admin']
];

$user_id = $_POST['user_id'] ?? 1; // Default to John
$action = $_POST['action'] ?? '';
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($users[$user_id])) {
        $user = $users[$user_id];
        
        switch ($action) {
            case 'view_balance':
                $message = "Balance for {$user['name']}: $" . number_format($user['balance'], 2);
                break;
            case 'view_details':
                $message = "Details for {$user['name']}:<br>Email: {$user['email']}<br>Role: {$user['role']}";
                break;
            case 'edit_details':
                $new_name = $_POST['new_name'] ?? '';
                $new_email = $_POST['new_email'] ?? '';
                if ($new_name && $new_email) {
                    $message = "Details updated for user ID $user_id:<br>Name: $new_name<br>Email: $new_email";
                } else {
                    $message = "Please provide both name and email to edit details.";
                }
                break;
        }
    } else {
        $message = "User ID $user_id not found.";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>CWE-471: Modification of Assumed-Immutable Data</title>
</head>
<body>
    <h1>CWE-471: Modification of Assumed-Immutable Data</h1>
    <h2> The user_id is a hidden field, but it can be modified to access other users' data</h2>
    
    <form method="post">
        <!-- VULNERABLE: Hidden field that users can modify to access other users' data -->
        <input type="hidden" name="user_id" value="<?php echo $user_id; ?>">
        
        <h3>User Actions</h3>
        <button type="submit" name="action" value="view_balance">View Balance</button>
        <button type="submit" name="action" value="view_details">View Personal Details</button>
        <button type="submit" name="action" value="edit_details">Edit Details</button>
    </form>
    
    <?php if ($message): ?>
        <div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">
            <strong>Result:</strong><br>
            <?php echo $message; ?>
        </div>
    <?php endif; ?>
    
    <?php if ($action === 'edit_details'): ?>
        <form method="post">
            <input type="hidden" name="user_id" value="<?php echo $user_id; ?>">
            <input type="hidden" name="action" value="edit_details">
            <h3>Edit Details</h3>
            <label>New Name: <input type="text" name="new_name" required></label><br>
            <label>New Email: <input type="email" name="new_email" required></label><br>
            <button type="submit">Update Details</button>
        </form>s
    <?php endif; ?>
</body>
</html>