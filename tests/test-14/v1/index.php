<?php
// Mock function to simulate fetching a role for a user - example guest role is set.
function getRole($user) {
    return 'Guest'; 
}

// Mock function to simulate showing a login screen.
function showLoginScreen() {
    echo "Please log in to access this resource.";
}

// Check the 'role' cookie for user authorization.
$role = $_COOKIE['role'] ?? null;
if (!$role) {
    // If no role is set, attempt to get the role for the user.
    $role = getRole('user');
    if ($role) {
        setcookie("role", $role, time() + 60 * 60 * 2);
    } else {
        showLoginScreen();
        die("\n");
    }
}

// Simulate accessing sensitive data with the 'Reader' role.
if ($role === 'Reader') {
    echo "This is a confidential record.";
} else {
    die("You are not authorized to view this record.\n");
}
?>
