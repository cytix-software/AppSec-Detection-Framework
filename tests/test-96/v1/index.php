<?php
session_start();
$message = '';
$message2 = '';
$message3 = '';
$users = ['user1', 'user2', 'user3']; // Example user list
$user = null;

function createUser() {
    // This function creates a user with the given username and password and gives them admin privileges
    $user = [
        'username' => 'user',
        'password' => 'password',
        'role' => 'admin'
    ];
    return $user;
}

if (isset($_POST['create_user'])) {
    $user = createUser();
    $message = "User created with default credentials (user & password), and with admin privileges.";
}

// simulate user login, settting session variables if credentials are correct
if (isset($_POST['username']) && isset($_POST['password'])) {
    if ($_POST['username'] === 'user' && $_POST['password'] === 'password') {
        $_SESSION['logged_in'] = true;
        $_SESSION['is_admin'] = true;
        $message2 = "Login successful!";
    }
    else {
        $message2 = "Invalid credentials!";
    }
}

// Simulate user deletion by checking if the user is logged in and has admin privileges through session variables
if (isset($_POST['username_delete'])) {
    if (!empty($_SESSION['logged_in']) && !empty($_SESSION['is_admin'])) {
        $username_to_delete = $_POST['username_delete'];
        if (in_array($username_to_delete, $users)) {
            $users[$username_to_delete] = null; // Simulate user deletion
            $message3 = "User '$username_to_delete' deleted successfully.";
        }
        else{
            $message3 = "User '$username_to_delete' does not exist.";
        }
    }
    else {
        $message3 = "You must be logged in with admin privileges to delete a user.";
    }
}

?>
<!DOCTYPE html>
<html>
<head>
    <title>Test-96</title> 
</head>
<body>
    <h1>Test-96</h1>
    <h2>Create User</h2>
    <form method="post">
        <button type="submit" name="create_user" value="1">Create User</button>
    </form>
        <?php if ($message): ?>
        <div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">
            <?= $message ?><br>
        </div>
    <?php endif; ?>
    <h2>Login</h2>
    <form method="post">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
        <button type="submit">Login</button>
    </form>
    <?php if ($message2): ?>
        <div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">
            <?= $message2 ?><br>
        </div>
    <?php endif; ?>
    <h2> Manage Users</h2>
    <form method="post">
    <label for="username_delete">Select user to delete:</label>
    <select name="username_delete" id="username_delte">
        <?php foreach ($users as $user): ?>
            <option value="<?= htmlspecialchars($user) ?>"><?= htmlspecialchars($user) ?></option>
        <?php endforeach; ?>
    </select>
    <button type="submit">Delete User</button>
    </form>
    <?php if ($message3): ?>
        <div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">
            <?= $message3 ?><br>
        </div>
    <?php endif; ?>
</body>
</html>