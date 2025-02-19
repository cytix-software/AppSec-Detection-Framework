<?php
session_start();

if (!isset($_SESSION['users'])) {
    $_SESSION['users'] = [
        1 => "Alice",
        2 => "Bob",
        3 => "Charlie"
    ];
}

function destroyUserData($userID) {
    if (isset($_SESSION['users'][$userID])) {
        unset($_SESSION['users'][$userID]);
        echo "<p style='color:red;'>User with ID $userID has been deleted.</p>";
    } else {
        echo "<p style='color:blue;'>No user found with ID $userID.</p>";
    }
}

// Handle request
if (isset($_GET['userID'])) {
    $userID = intval($_GET['userID']);
    destroyUserData($userID);
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Deletion</title>
</head>
<body>
    <h1>Delete User</h1>
    <form method="GET">
        <label for="userID">Enter User ID to delete:</label>
        <input type="number" id="userID" name="userID" required>
        <button type="submit">Delete</button>
    </form>
</body>
</html>
