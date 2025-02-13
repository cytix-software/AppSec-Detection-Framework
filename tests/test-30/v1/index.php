<?php
class User {
    public $username;
    public $email;
    public $password;
    public $isAdmin = false; // Internal attribute, should not be modifiable by users

    public function __construct($data) {
        foreach ($data as $key => $value) {
            $this->$key = $value; // Mass assignment vulnerability
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userData = $_POST; // Accepts user input directly
    $user = new User($userData); // Creates a user object with dynamic attributes
    
    echo "User Created: <br>";
    echo "Username: " . htmlspecialchars($user->username) . "<br>";
    echo "Email: " . htmlspecialchars($user->email) . "<br>";
    echo "Admin Status: " . ($user->isAdmin ? "Yes" : "No") . "<br>";
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Vulnerable Mass Assignment Demo</title>
</head>
<body>
    <h2>Create User</h2>
    <form method="POST">
        <label>Username: <input type="text" name="username" required></label><br>
        <label>Email: <input type="email" name="email" required></label><br>
        <label>Password: <input type="password" name="password" required></label><br>
        <input type="submit" value="Create User">
    </form>
</body>
</html>