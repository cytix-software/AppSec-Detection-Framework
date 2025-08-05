<?php
// CWE-470: Use of Externally-Controlled Input to Select Classes or Code ('Unsafe Reflection')
// This script demonstrates allowing user input to control which class is instantiated, without restricting access to sensitive classes.

class PublicInfo {
    public function getInfo() {
        return "This is public information.";
    }
}

class SecretData {
    public function getInfo() {
        return "<b>Secret:</b> The admin password is 'hunter2'.";
    }
}

class SystemInfo {
    public function getInfo() {
        return "<b>System:</b> PHP version: " . phpversion();
    }
}

$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $class = $_POST['class'] ?? '';
    // VULNERABLE: No restriction on which class can be instantiated
    if (class_exists($class)) {
        $obj = new $class();
        $message = $obj->getInfo();
    } else {
        $message = "Class '$class' does not exist.";
    }
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>CWE-470: Unsafe Reflection</title>
</head>
<body>
    <h1>CWE-470: Unsafe Reflection</h1>
    <form method="post">
        <label for="class">Select class to get info (There are 3 classes, PublicInfo, SecretData, and SystemInfo):</label><br>
        <input type="text" id="class" name="class" placeholder="PublicInfo, SecretData, or SystemInfo">
        <button type="submit">Get Info</button>
    </form>
    <?php if ($message): ?>
        <div style="margin: 10px 0; padding: 10px; background-color: #f0f0f0; border: 1px solid #ccc;">
            <?php echo $message; ?>
        </div>
    <?php endif; ?>
</body>
</html> 