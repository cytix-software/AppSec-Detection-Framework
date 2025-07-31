<?php
// CWE-89: Improper Neutralization of Special Elements Used in an SQL Command ('SQL Injection')
// This script demonstrates SQL injection by using user input directly in SQL queries.
// sensitive data in /users.db is accessible to anyone, so CWE-922
// and there is no authorisation check when accessing /users.db or confirming whether the user is authorised to access the data, CWE-285

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
        // VULNERABLE: User input directly in SQL query without sanitization
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
    <title>CWE-89: SQL Injection</title>
</head>
<body>
    <h1>CWE-89: SQL Injection</h1>
    <h2>User Lookup</h2>
    <form method="post">
        <input type="text" name="user_id" required>
        <button type="submit">Submit</button>
    </form>
</body>
</html> 