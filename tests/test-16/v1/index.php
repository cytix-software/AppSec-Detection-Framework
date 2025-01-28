<form action="" method="post">
 Enter URL to download HTML: <br/><input type="text" name="name" id="name">
 <input type="submit" value="Submit">
</form>

<?php
 if ($_SERVER['REQUEST_METHOD'] == 'POST') {
 $name = $_POST['name'];
 echo htmlentities(exec("curl $name"));
 }
?>