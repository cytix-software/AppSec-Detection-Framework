// CWE-548: Exposure of Information Through Directory listing
<form action="" method="post">
    <input type="text" name="input" id="input">
    <input type="submit" value="Submit">
</form>

// simply takes input and prints it
<?php
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $output = $_POST['input'];
        echo exec("echo $output");
    }
?> 