<?php
setcookie('session_token', 'sensitive_session_value', [
    'expires' => time() + 3600,
    'path' => '/',
    'secure' => false,
    'httponly' => false
]);
?>

<!DOCTYPE html>
<html>
<body>
    <script>document.write(document.cookie)</script>
</body>
</html> 