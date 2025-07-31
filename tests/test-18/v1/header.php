<?php
// Simple endpoint that sets a header based on user input
$val = $_GET['val'] ?? '';
header("X-Custom-Header: $val");
echo "Header set: X-Custom-Header: $val";
?> 