<?php
//cwe-98: using the example 1.

if (isset($_GET['module_name'])) {
    $dir = $_GET['module_name']; // Retrieves user input without validation
    include($dir . "/function.php"); // Directly includes the file (RFI)
} else {
    echo "Module name required.";
}
?>
