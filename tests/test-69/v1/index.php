<?php
// SQLite database connection
$db_path = '/var/www/html/users.db';
try {
    $pdo = new PDO("sqlite:$db_path");
} catch(PDOException $e) {
    echo "Database connection failed: " . $e->getMessage();
    $pdo = null;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_POST['user_id'] ?? '';
    
    if ($pdo) {
        $sql = "SELECT * FROM users WHERE id = $user_id";
        
        try {
            $stmt = $pdo->query($sql);
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if ($rows) {
                foreach ($rows as $row) {
                    echo $row['id'] . " " . $row['username'] . " " . $row['email'] . "\n";
                }
            } else {
                echo "No users found.\n";
            }
        } catch(PDOException $e) {
            echo "Query error: " . $e->getMessage();
        }
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test 69</title>
</head>
<body>
    <h1>SQL Injection Test</h1>
    <h2>User Lookup</h2>
    <form method="post">
        <input type="text" name="user_id" required>
        <button type="submit">Submit</button>
    </form>
</body>
</html>