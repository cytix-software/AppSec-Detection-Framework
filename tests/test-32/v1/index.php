<?php
$users = [
    "Desmond" => [
        "email"           => "desmond@themoon.com",
        "password"        => "password123",
        "security_question" => "What is your favorite color?",
        "security_answer" => "blue"
    ]
];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['recover'])) {
    $username        = isset($_POST['username']) ? trim($_POST['username']) : '';
    $email           = isset($_POST['email']) ? trim($_POST['email']) : '';
    $security_answer = isset($_POST['security_answer']) ? strtolower(trim($_POST['security_answer'])) : '';

    if (isset($users[$username])) {
        $user = $users[$username];
        if ($user['email'] === $email && strtolower($user['security_answer']) === $security_answer) {
            echo "<p>Password recovery successful! Your password is: <strong>" . htmlspecialchars($user['password']) . "</strong></p>";
        } else {
            echo "<p>Error: Invalid email or security answer provided.</p>";
        }
    } else {
        echo "<p>Error: User not found.</p>";
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Password Recovery</title>
</head>
<body>
    <h1>Password Recovery</h1>
    <form method="post" action="index.php">
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username" required><br><br>

        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email" required><br><br>

        <label for="security_answer">Security Question: What is your favorite color?</label><br>
        <input type="text" id="security_answer" name="security_answer" required><br><br>

        <input type="submit" name="recover" value="Recover Password">
    </form>
</body>
</html>
