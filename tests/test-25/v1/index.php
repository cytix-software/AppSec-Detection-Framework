<?php

if (isset($_GET['module_name'])) {
    $dir = $_GET['module_name']; // Retrieves user input
    include($dir . "/function.php"); // Directly includes the file 
} else {
    echo "Module name required.";
}
?>
