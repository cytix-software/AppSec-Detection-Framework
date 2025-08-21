<!DOCTYPE html>
<html>
<head>
    <title>Test 71</title>
</head>
<body>
    <h1>Test 71</h1>
    
    <h2>Search Users</h2>
    <form method="post">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" value="<?php echo htmlspecialchars($_POST['username'] ?? ''); ?>" placeholder="Enter username">
        <button type="submit">Search</button>
    </form>
    
    <?php
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['username'])) {
        $username = $_POST['username'];
        
        // creates a static XML file
        $xml_data = '<?xml version="1.0" encoding="UTF-8"?>
        <users>
            <user>
                <username>admin</username>
                <email>admin@example.com</email>
                <department>IT</department>
            </user>
            <user>
                <username>john</username>
                <email>john@example.com</email>
                <department>HR</department>
            </user>
            <user>
                <username>jane</username>
                <email>jane@example.com</email>
                <department>Finance</department>
            </user>
            <user>
                <username>bob</username>
                <email>bob@example.com</email>
                <department>Marketing</department>
            </user>
            <user>
                <username>alice</username>
                <email>alice@example.com</email>
                <department>Sales</department>
            </user>
        </users>';
        
        // concatenate username into XPath query
        $xpath_query = "//user[username='" . $username . "']";
        
        // insert username into XML data
        if (strpos($username, '<user>') !== false) {
            $xml_data = str_replace('</users>', $username . '</users>', $xml_data);
        }
        
        // search the XML data using XPath query
        $results = searchXmlData($xml_data, $xpath_query);
        
        // print the results
        if (!empty($results)) {
            echo '<h3>Search Results:</h3>';
            echo '<p>Found ' . count($results) . ' users</p>';
            echo '<table border="1">';
            echo '<tr><th>Username</th><th>Email</th><th>Department</th></tr>';
            foreach ($results as $user) {
                echo '<tr>';
                echo '<td>' . htmlspecialchars($user['username']) . '</td>';
                echo '<td>' . htmlspecialchars($user['email']) . '</td>';
                echo '<td>' . htmlspecialchars($user['department']) . '</td>';
                echo '</tr>';
            }
            echo '</table>';
        } else {
            echo '<p>No users found.</p>';
        }
    }
    
    // function to search the XML data
    function searchXmlData($xml_data, $xpath_query) {
        $dom = new DOMDocument();
        $dom->loadXML($xml_data);
        
        $xpath = new DOMXPath($dom);
        
        try {
            $nodes = $xpath->query($xpath_query);
            $results = [];
            
            foreach ($nodes as $node) {
                $username = $node->getElementsByTagName('username')->item(0)->textContent;
                $email = $node->getElementsByTagName('email')->item(0)->textContent;
                $department = $node->getElementsByTagName('department')->item(0)->textContent;
                
                $results[] = [
                    'username' => $username,
                    'email' => $email,
                    'department' => $department
                ];
            }
            
            return $results;
        } catch (Exception $e) {
            return [];
        }
    }
    ?>
</body>
</html>