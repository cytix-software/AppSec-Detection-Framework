<?php
session_start();

// Simulate user authentication
if (!isset($_SESSION['user'])) {
    $_SESSION['user'] = [
        'role' => 'user'  // Regular user role
    ];
}

// returns admin data 
function getAdminData() {
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
    <title>Test 56</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .important { color: red; }
    </style>
</head>
<body>
    <h1>Test 56</h1>
    <p>Current role: <span class="important"><?php echo htmlspecialchars($_SESSION['user']['role']); ?></span></p>
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