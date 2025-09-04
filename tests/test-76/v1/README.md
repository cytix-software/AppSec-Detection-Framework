# Test 76 - CWE-90: LDAP Injection (Python)

This test case demonstrates LDAP Injection (CWE-90) in a Python application.

## Description

User input is directly interpolated into an LDAP search filter, making the application vulnerable to LDAP injection attacks.

## Usage

1. Build and run the application using Docker Compose: `docker-compose up --build`
2. Access the app at http://localhost:8080
3. Enter a username (e.g., `john`) or an LDAP injection payload (e.g., `*)(uid=*)`)
4. Observe the results and the constructed LDAP query.

## Example Payloads

- **Normal Query:** `john`
  - **Resulting Filter:** `(uid=john)`
  - **Result:** Returns only the 'john' user record.
- **Injection Payload (Information Disclosure):** `*`
  - **Resulting Filter:** `(uid=*)`
  - **Explanation:** This is a successful injection. The `*` acts as a wildcard, matching any entry that has a `uid` attribute. The query effectively becomes "find all users," bypassing the need to know a specific username and leaking all user records in the directory.

```python
# A minimal, vulnerable filter. User input is directly embedded.
ldap_filter = f'(uid={user})'
```