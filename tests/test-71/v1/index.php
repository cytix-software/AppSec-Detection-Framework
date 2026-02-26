<?php
session_start();

if (!isset($_SESSION['xml_data'])) {
    $_SESSION['xml_data'] = '<?xml version="1.0" encoding="UTF-8"?>
    <data>
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
        </users>

        <!-- Audit log for search terms -->
        <searchLog></searchLog>
    </data>';
}

function appendSearchLog_unescaped(string $xml_data, string $term): string {
    $entry =
        "<search>" .
            "<term>" . $term . "</term>" .
            "<ts>" . date('c') . "</ts>" .
        "</search>";

    return str_replace('</searchLog>', $entry . '</searchLog>', $xml_data);
}

function getRecentSearchTerms(string $xml_data, int $limit = 5): array {
    $dom = new DOMDocument();
    if (!@$dom->loadXML($xml_data)) return [];

    $xpath = new DOMXPath($dom);
    $nodes = $xpath->query('//searchLog/search/term');
    if (!$nodes) return [];

    $terms = [];
    foreach ($nodes as $n) $terms[] = $n->textContent;

    return array_slice($terms, -$limit);
}

function mergeUsers(array ...$lists): array {
    $out = [];
    foreach ($lists as $list) {
        foreach ($list as $u) {
            $key = strtolower(trim($u['email'] ?? '')) ?: md5(json_encode($u));
            if (!isset($out[$key])) $out[$key] = $u;
        }
    }
    return array_values($out);
}

function renderUserTable(array $results): void {
    if (!$results) {
        echo "<p>No users found.</p>";
        return;
    }
    echo "<p>Found " . count($results) . " users</p>";
    echo "<table border='1'>";
    echo "<tr><th>Username</th><th>Email</th><th>Department</th></tr>";
    foreach ($results as $u) {
        echo "<tr>";
        echo "<td>" . htmlspecialchars($u['username']) . "</td>";
        echo "<td>" . htmlspecialchars($u['email']) . "</td>";
        echo "<td>" . htmlspecialchars($u['department']) . "</td>";
        echo "</tr>";
    }
    echo "</table>";
}

function searchXmlData_xpath(string $xml_data, string $username): array {
    $dom = new DOMDocument();
    if (!@$dom->loadXML($xml_data)) return [];

    $xpath = new DOMXPath($dom);

    $xpath_query = "//user[username='" . $username . "']";

    try {
        $nodes = $xpath->query($xpath_query);
        if (!$nodes) return [];

        $results = [];
        foreach ($nodes as $node) {
            $results[] = [
                'username' => $node->getElementsByTagName('username')->item(0)?->textContent ?? '',
                'email' => $node->getElementsByTagName('email')->item(0)?->textContent ?? '',
                'department' => $node->getElementsByTagName('department')->item(0)?->textContent ?? '',
            ];
        }
        return $results;
    } catch (Throwable $e) {
        return [];
    }
}

function searchXmlData_basex(string $xml_data, string $username): array {
    $basexBase = "http://test_71_basex:8984/rest";
    $basexUser = "admin";
    $basexPass = "admin";

    $xquery = "let \$doc := parse-xml(" . var_export($xml_data, true) . ")
               for \$u in \$doc//user[username = '$username']
               return <user>
                        <username>{data(\$u/username)}</username>
                        <email>{data(\$u/email)}</email>
                        <department>{data(\$u/department)}</department>
                      </user>";

    $url = $basexBase . "?query=" . urlencode($xquery) . "&method=xml";

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
        CURLOPT_USERPWD => $basexUser . ":" . $basexPass,
        CURLOPT_TIMEOUT => 5,
    ]);

    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($resp === false || $code >= 400 || trim($resp) === '') return [];

    $wrapped = "<users>$resp</users>";
    $dom = new DOMDocument();
    if (!@$dom->loadXML($wrapped)) return [];

    $results = [];
    foreach ($dom->getElementsByTagName("user") as $node) {
        $results[] = [
            "username" => $node->getElementsByTagName("username")->item(0)?->textContent ?? "",
            "email" => $node->getElementsByTagName("email")->item(0)?->textContent ?? "",
            "department" => $node->getElementsByTagName("department")->item(0)?->textContent ?? "",
        ];
    }
    return $results;
}
?>
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
        <input type="text" id="username" name="username"
               value="<?php echo htmlspecialchars($_POST['username'] ?? ''); ?>"
               placeholder="Enter username">
        <button type="submit">Search</button>
    </form>

<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['username'])) {
    $username = $_POST['username'];

    // load persisted XML
    $xml_data = $_SESSION['xml_data'];
    $xml_data = appendSearchLog_unescaped($xml_data, $username);

    // persist back
    $_SESSION['xml_data'] = $xml_data;

    // perform both queries against the current XML
    $xpath_results  = searchXmlData_xpath($xml_data, $username);
    $xquery_results = searchXmlData_basex($xml_data, $username);

    echo "<hr>";
    echo "<h3>Results</h3>";
    $merged = mergeUsers($xpath_results, $xquery_results);
    renderUserTable($merged);

    // show the audit log
    echo "<hr>";
    echo "<h3>Recent search terms (from server-side XML audit log)</h3>";
    $recent = getRecentSearchTerms($xml_data, 8);
    if (!$recent) {
        echo "<p>No search terms logged.</p>";
    } else {
        echo "<ul>";
        foreach ($recent as $t) {
            echo "<li>" . htmlspecialchars($t) . "</li>";
        }
        echo "</ul>";
    }
}
?>

</body>
</html>