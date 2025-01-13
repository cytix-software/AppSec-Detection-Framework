<a href=?image=1.png>1</a>

<?php
    if (isset($_GET['image'])) {
        $image = htmlentities($_GET['image']);
        echo "<img src=./$image />";
    }
?>