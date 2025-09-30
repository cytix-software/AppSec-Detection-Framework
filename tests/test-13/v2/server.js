const express = require('express');

const app = express();
const port = 80;

// Example employee data to simulate a database
const employees = {
  DesmondB: { name: 'Desmond Bear', position: 'Moon Bear', email: 'Desmond.Bear@example.com' },
  DougalF: { name: 'Dougal Flop', position: 'Flop Guy', email: 'Dougal.Flop@example.com' },
};

function runEmployeeQuery(employeeMap, name) {
  return employeeMap[name] || null;
}

app.get('/', (req, res) => {
  const employeeName = req.query.EmployeeName;
  if (!employeeName) {
    return res.send(`<p>Please provide an employee name to query.</p>
      <form method="GET">
          <label for="EmployeeName">Enter Employee Name:</label>
          <input type="text" name="EmployeeName" id="EmployeeName" required>
          <input type="submit" value="Fetch Employee Data">
      </form>
      `);
  }

  const employeeData = runEmployeeQuery(employees, employeeName);
  if (employeeData) {
    res.send(
      `<h1>Employee Information:</h1>
      <p>Name: ${employeeData.name}</p>
      <p>Position: ${employeeData.position}</p>
      <p>Email: ${employeeData.email}</p>
      <form method="GET">
          <label for="EmployeeName">Enter Employee Name:</label>
          <input type="text" name="EmployeeName" id="EmployeeName" required>
          <input type="submit" value="Fetch Employee Data">
      </form>
      `);
  } else {
    res.send(`<p>No employee found with the name ${employeeName}.</p>`);
  }
});

app.listen(port, () => {
  console.log(`Test 13 v2 server running on port ${port}`);
});


