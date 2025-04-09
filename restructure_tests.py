import json

# Read the data.json file
with open('data.json', 'r') as f:
    data = json.load(f)

# Create a dictionary to group tests by scanner
scanner_tests = {}

# Process each test and group by scanner
for test in data['recordedTests']:
    scanner = test.pop('scanner')  # Remove scanner from test object and get its value
    if scanner not in scanner_tests:
        scanner_tests[scanner] = []
    scanner_tests[scanner].append(test)

# Replace the recordedTests array with the new structure
data['recordedTests'] = scanner_tests

# Write the modified data back to data.json
with open('data.json', 'w') as f:
    json.dump(data, f, indent=2) 