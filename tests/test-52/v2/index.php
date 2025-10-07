<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $username = $input['username'] ?? null;
    $password = $input['password'] ?? null;

    header('Content-Type: application/json');

    // Simulate authentication
    if ($username === 'admin' && $password === 'password123') {
        echo json_encode([
            'status' => 'success',
            'message' => 'Login successful',
            // Send sensitive data 
            'userData' => [
                'id' => 1,
                'role' => 'admin',
                'apiKey' => 'FAKE_API_KEY_1234567890',
                'sessionToken' => 'FAKE_SESSION_TOKEN_1234567890'
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid credentials'
        ]);
    }
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Test 52</title>
</head>
<body>
    <h1>Test 52</h1>
    <form id="loginForm">
        <input type="text" id="username" placeholder="Username" required><br><br>
        <input type="password" id="password" placeholder="Password" required><br><br>
        <button type="submit">Login</button>
    </form>
    <div id="result"></div>

    <script>
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/index.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
                const data = await response.json();
                document.getElementById('result').textContent = JSON.stringify(data, null, 2);
            } catch (error) {
                document.getElementById('result').textContent = 'Error: ' + error.message;
            }
        });
    </script>
</body>
</html>
