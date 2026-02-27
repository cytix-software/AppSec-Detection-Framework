<?php
session_start();

if (!isset($_SESSION['users'])) {
    $_SESSION['users'] = [
        ["username" => "alice", "role" => "user",  "email" => "alice@example.com"],
        ["username" => "bob",   "role" => "admin", "email" => "bob@example.com"],
        ["username" => "charlie","role" => "user", "email" => "charlie@example.com"],
    ];
}

$users = &$_SESSION['users']; // IMPORTANT: reference so deletes persist

$message = '';
$profile = '';
$role = 'user'; // pretend current user

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

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'POST' && isset($_POST['_method'])) {
    $method = strtoupper($_POST['_method']);
}

if ($method === 'DELETE') {
    $message = deleteAllUsers($users);
} elseif ($method === 'POST') {
    if (isset($_POST['view_user'], $_POST['username'])) {
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
        <input type="hidden" name="_method" value="DELETE">
        <button type="submit">Delete All Users</button>
    </form>

    <?php if ($message): ?>
        <div class="msg"><?= htmlspecialchars($message) ?></div>
    <?php endif; ?>

    <h2>View User Details</h2>
    <form method="post">
        <label for="username">Select user:</label>
        <select name="username" id="username">
            <?php foreach ($users as $u): ?>
                <option value="<?= htmlspecialchars($u['username']) ?>"><?= htmlspecialchars($u['username']) ?></option>
            <?php endforeach; ?>
        </select>
        <button type="submit" name="view_user" value="1">View Details</button>
    </form>

    <?php if ($profile): ?>
        <div class="msg"><?= htmlspecialchars($profile) ?></div>
    <?php endif; ?>
</body>
</html>