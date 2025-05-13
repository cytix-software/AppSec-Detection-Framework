<?php
// CWE-284: Improper Access Control
// This application demonstrates improper access control by not checking user roles

session_start();

// Simulate user authentication
if (!isset($_SESSION['user'])) {
    $_SESSION['user'] = [
        'role' => 'user'  // Regular user role
    ];
}

// Vulnerable function: No proper access control check
function getAdminData() {
    // Missing proper role check
    return [
        'admin_users' => [
            ['username' => 'admin1', 'email' => 'admin1@example.com'],
            ['username' => 'admin2', 'email' => 'admin2@example.com']
        ],
        'system_settings' => [
            'maintenance_mode' => false,
            'debug_mode' => true
        ]
    ];
}

// Handle admin data request
if (isset($_GET['action']) && $_GET['action'] === 'get_admin_data') {
    header('Content-Type: application/json');
    echo json_encode(getAdminData());
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>CWE-284</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .vulnerable { color: red; }
    </style>
</head>
<body>
    <h1>CWE-284: Improper Access Control</h1>
    <p>Current role: <span class="vulnerable"><?php echo htmlspecialchars($_SESSION['user']['role']); ?></span></p>
    <button onclick="fetchAdminData()" disabled>Get Admin Data</button>
    <div id="result" style="margin-top: 20px;"></div>

    <script>
    function fetchAdminData() {
        fetch('?action=get_admin_data')
            .then(response => response.json())
            .then(data => {
                document.getElementById('result').innerHTML = 
                    '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
            });
    }
    </script>
</body>
</html> 