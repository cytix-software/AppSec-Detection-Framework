<?php
$users = [
    ["username" => "alice", "role" => "user", "email" => "alice@example.com"],
    ["username" => "bob", "role" => "admin", "email" => "bob@example.com"],
    ["username" => "charlie", "role" => "user", "email" => "charlie@example.com"],
];
$message = '';
$profile = '';
$role = 'user';

function deleteAllUsers(&$users) {
    $users = [];
    return "All users deleted!";
}

function viewProfile($users, $user) {
    global $role;
    if ($role === 'user' || $role === 'admin') {
        foreach ($users as $u) {
            if ($u["username"] === $user) {
                return "Username: {$u['username']}, Role: {$u['role']}, Email: {$u['email']}";
            }
        }
    }
    return "User not found";
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['delete_all'])) {
        $message = deleteAllUsers($users);
    }
    if (isset($_POST['view_user']) && isset($_POST['username'])) {
        $profile = viewProfile($users, $_POST['username']);
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test 102</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 2em; }
        .msg { margin: 10px 0; padding: 10px; background: #f0f0f0; border: 1px solid #ccc; }
    </style>
</head>
<body>
    <h1>Test 102</h1>
    <h2>Delete All Users</h2>
    <form method="post">
        <button type="submit" name="delete_all" value="1">Delete All Users</button>
    </form>
    <?php if ($message): ?>
        <div class="msg"> <?= htmlspecialchars($message) ?> </div>
    <?php endif; ?>
    <h2>View User Details</h2>
    <form method="post">
        <label for="username">Select user:</label>
        <select name="username" id="username">
            <?php foreach ($users as $u): ?>
                <option value="<?= htmlspecialchars($u['username']) ?>"> <?= htmlspecialchars($u['username']) ?> </option>
            <?php endforeach; ?>
        </select>
        <button type="submit" name="view_user" value="1">View Details</button>
    </form>
    <?php if ($profile): ?>
        <div class="msg"> <?= htmlspecialchars($profile) ?> </div>
    <?php endif; ?>

