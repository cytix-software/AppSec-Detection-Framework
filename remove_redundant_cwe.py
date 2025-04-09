import json

def remove_redundant_cwe():
    # Read the data.json file
    with open('data.json', 'r') as f:
        data = json.load(f)

    # Process each vulnerability to remove the redundant CWE array
    for vuln in data['vulnerabilities']:
        # The CWE array is redundant since we can derive it from CWEDetails
        if 'CWE' in vuln:
            del vuln['CWE']

    # Save the updated data back to data.json
    with open('data.json', 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    try:
        remove_redundant_cwe()
        print("Successfully removed redundant CWE arrays from data.json")
    except Exception as e:
        print(f"Error occurred while removing redundant CWE arrays: {str(e)}") 