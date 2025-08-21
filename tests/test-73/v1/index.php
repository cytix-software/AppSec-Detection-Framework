<?php
// allows user input to control which class is called
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
// call getInfo method of the class specified by user input
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $class = $_POST['class'] ?? '';
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
    <title>Test 73</title>
</head>
<body>
    <h1>Test 73</h1>
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