<?php
// CWE-1104: Use of Unmaintained Third Party Components
// Demonstrates CVE-2015-9251: XSS vulnerability in jQuery.get()
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test 44</title>
    <script src="https://code.jquery.com/jquery-1.6.4.min.js"></script>
</head>
<body>
    <form id="searchForm">
        <input type="text" id="searchInput" placeholder="Enter search term">
        <button type="submit">Search</button>
    </form>
    <div id="result"></div>

    <script>
        $('#searchForm').submit(function(e) {
            e.preventDefault();
            var userInput = $('#searchInput').val();
            $('#result').html(userInput);
        });
    </script>
</body>
</html>
