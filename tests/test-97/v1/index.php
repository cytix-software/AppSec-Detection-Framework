<?php
$users = [
    'user1' => 'asjfkasnjkfksaf',
    'user2' => 'fsdafkjsaf',
    'user3' => 'asjkfksajnkfjas'
];
// Simulate being logged in as a user with regular user privileges (not admin)
$currentUser = 'user4';
$currentUserPrivileges = 'user';
$message = '';


// Simulates resetting a user's password, only for users with admin privileges
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['reset_password'])) {
        $userToReset = $_POST['reset_password'];

        // checks if the current user has admin privileges, if so resets to a default password
        if ($currentUserPrivileges === 'admin') {
            if (array_key_exists($userToReset, $users)) {
                // Reset the password to a default value
                $users[$userToReset] = 'defaultpassword';
                $message = "Password for '$userToReset' has been reset to 'defaultpassword'.";
            } else {
                $message = "User '$userToReset' does not exist.";
            }
        // if the user does not have admin privileges, prints error with current password to help them becasuse they cant reset it
        } else {
            $message = "You do not have permission to reset passwords! Here is the current password for '$userToReset': '" . htmlspecialchars($users[$userToReset]) . "'";
        }
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test-97</title>
</head>
<body>
    <h1>Test-97</h1>
        <h2> You are currently logged in as 'user4' with 'user' privileges</h2>
        <h2> Reset Passwords</h2>
    <form method="post">
    <label for="reset_password">Select a user to reset password for (only for admins):</label>
    <select name="reset_password" id="reset_password">
        <?php foreach ($users as $username => $password): ?>
            <option value="<?= htmlspecialchars($username) ?>"><?= htmlspecialchars($username) ?></option>
        <?php endforeach; ?>
    </select>
    <button type="submit">Reset Password</button>
    </form>
    <?php if ($message): ?>
        <div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">
            <?= $message ?><br>
        </div>
    <?php endif; ?>
</body>
</html> 