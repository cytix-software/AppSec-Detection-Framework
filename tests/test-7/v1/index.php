<form action="" method="post">
    <input type="text" name="input" value="YToyOntpOjA7czo4OiJKb2huIERvZSI7aToxO3M6NToiQ3l0aXgiO30=" id="input">
    <input type="submit" value="Submit">
</form>

<?php 
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $input = base64_decode($_POST['input']); 
        class PHPObjectInjection{
            public $inject;
            function __construct(){
        }
        function __wakeup(){
            if(isset($this->inject)){
               eval($this->inject);
            }
        }
        }
        $output=unserialize($input);
        echo $output[0];
    }
?>