<?php
// CWE-235: Improper Handling of Extra Parameters
// Simulated vulnerable API endpoint

// Simulated user data
$users = [
    '1' => ['name' => 'Alice', 'email' => 'alice@example.com'],
    '2' => ['name' => 'Bob', 'email' => 'bob@example.com'],
    '3' => ['name' => 'Charlie', 'email' => 'charlie@example.com'],
];

// Parse POST body for multiple 'userid' parameters
parse_str(file_get_contents('php://input'), $params);

if (isset($params['userid'])) {
    $userids = (array)$params['userid'];
    $result = [];
    foreach ($userids as $i => $id) {
        if ($i === 0) {
            // Only allow Alice's data for the first userid
            if ($id === '1' && isset($users[$id])) {
                $result[] = $users[$id];
            } else {
                $result[] = ['error' => 'Access denied'];
            }
        } else {
            // For subsequent userids, skip access control
            if (isset($users[$id])) {
                $result[] = $users[$id];
            }
        }
    }
    if ($result) {
        echo json_encode($result);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'User(s) not found']);
    }
} else {
    http_response_code(400);
    echo json_encode(['error' => 'Missing userid']);
}
?>
