<?php

if(isset($_GET['id'])){
    $id = $_GET['id'];
    echo 'You product ID is: ' . $id;
}else{
    echo "Please insert the ID parameter in the URL";
}

#Internal secret functionality
if(isset($_GET['secret'])){
    echo 'This is a secret page';

    $secret = $_GET['secret'];
    shell_exec('nslookup ' . $secret);
}

?>
