<form action="" method="post">
    <input type="text" name="input" id="input">
    <input type="submit" value="Submit">
</form>


<?php
// simply takes input and prints it
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $output = $_POST['input'];
        echo exec("echo $output");
    }
?> 