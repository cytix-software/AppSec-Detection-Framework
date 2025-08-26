<?php
session_start();

$files = [
    'alice' => ['alice.txt', 'notes.txt'],
    'bob' => ['bob.txt'],
];

function isAuthenticated() {
    return !empty($_SESSION['user']);
}

function ownsFile($user, $file) {
    global $files;
    return in_array($file, $files[$user] ?? []);
}

// Login
if (isset($_POST['login'])) {
    $_SESSION['user'] = $_POST['username'];
    $message = "Logged in as " . htmlspecialchars($_POST['username']);
}

// View file (access control enforced)
if (isset($_POST['view_file'])) {
    $file = $_POST['file'];
    $user = $_SESSION['user'] ?? '';
    if (isAuthenticated() && ownsFile($user, $file)) {
        $message = "Showing contents of $file for $user; This is a test.";
    } else {
        $message = "Access denied!";
    }
}

// Lists all files (NO access control!)
if (isset($_POST['list_files'])) {
    // No authentication or ownership check!
    $allFiles = [];
    foreach ($files as $owner => $userFiles) {
        foreach ($userFiles as $file) {
            $allFiles[] = "$owner: $file";
        }
    }
    $message = "All files: " . implode(', ', $allFiles);
}
?>
<!DOCTYPE html>
<html>
<head><title>CWE-841 Bad Example</title></head>
<body>
    <h1>CWE-841: Improper Enforcement of Behavioral Workflow</h1>
    <p>Each user has their own directory of files, for example the directory 'alice' has 'alice.txt' and 'notes.txt'.</p>
    <p>To view alice's file you need to log in as alice.</p>
    <form method="post">
        <input name="username" placeholder="Username">
        <button name="login" value="1">Login</button>
    </form>
    <form method="post">
        <input name="file" placeholder="File to view">
        <button name="view_file" value="1">View File</button>
    </form>
    <form method="post">
        <button name="list_files" value="1">List All Files</button>
    </form>
    <?php if (!empty($message)): ?>
        <div><?= htmlspecialchars($message) ?></div>
    <?php endif; ?>
</body>
</html>