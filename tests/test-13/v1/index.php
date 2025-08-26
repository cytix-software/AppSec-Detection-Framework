<?php
// Example employee data array to simulate database.
$employees = [
    'DesmondB' => ['name' => 'Desmond Bear', 'position' => 'Moon Bear', 'email' => 'Desmond.Bear@example.com'],
    'DougalF' => ['name' => 'Dougal Flop', 'position' => 'Flop Guy', 'email' => 'Dougal.Flop@example.com']
];

// Function to fetch employee data
function runEmployeeQuery($employees, $name){
    if (isset($employees[$name])) {
        return $employees[$name];
    }
    return null;
}

// Check for employee in GET request.
if (isset($_GET['EmployeeName'])) {
    $employeeName = $_GET['EmployeeName'];
    $employeeData = runEmployeeQuery($employees, $employeeName);

    // Display the employee data.
    if ($employeeData) {
        echo "<h1>Employee Information:</h1>";
        echo "<p>Name: " . $employeeData['name'] . "</p>";
        echo "<p>Position: " . $employeeData['position'] . "</p>";
        echo "<p>Email: " . $employeeData['email'] . "</p>";
    } else {
        echo "<p>No employee found with the name $employeeName.</p>";
    }
} else {
    echo "<p>Please provide an employee name to query.</p>";
}
?>

<form method="GET">
    <label for="EmployeeName">Enter Employee Name:</label>
    <input type="text" name="EmployeeName" id="EmployeeName" required>
    <input type="submit" value="Fetch Employee Data">
</form>
