<form method="POST" action="">
        <input type="text" name="input">
        <button type="submit">Submit</button>
</form>

<?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $output = htmlspecialchars($_POST['input']);
        echo "$output";
    }
?>