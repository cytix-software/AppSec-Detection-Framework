<!DOCTYPE html>
<html>
<head>
    <title>Vulnerable JavaScript Loading</title>
    <!-- CWE-494: Loading External Code Without Integrity Check -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
</head>
<body>
    <h1>jQuery Library Test</h1>
    <div id="output"></div>
    <button id="testButton">Test jQuery</button>
    <script>
        // This code will execute whatever is in the external library
        if (typeof jQuery !== 'undefined') {
            $('#testButton').on('click', function() {
                $('#output').text('jQuery loaded and executed successfully');
            });
        } else {
            document.getElementById('output').textContent = 'jQuery failed to load';
        }
    </script>
</body>
</html>
