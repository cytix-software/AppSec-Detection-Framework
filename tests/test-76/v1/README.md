# Test 76 - CWE-90: LDAP Injection (PHP)

This test case demonstrates LDAP Injection (CWE-90) in a PHP application.

## Description

User input is directly interpolated into an LDAP search filter, making the application vulnerable to LDAP injection attacks.

## Usage

1. Build and run the application (see Docker instructions below).
2. Access the app at http://localhost:8080
3. Enter a username (e.g., `admin`) or an LDAP injection payload (e.g., `*)(uid=*)`)
4. Observe the results and the constructed LDAP query.

## Example Payloads

- `admin` (normal user)
- `*)(uid=*)` (returns all users)
- `admin)(|(uid=*))` (bypass)
- `*` (wildcard)

## Docker

This app expects an LDAP server (e.g., OpenLDAP) running and accessible as `openldap` on port 389.

```sh
docker build -t test-76-ldap-inject .
docker run -p 8080:80 --network <your_network> test-76-ldap-inject
```

## Vulnerable Code

```php
$filter = "(uid=$ldap_user)"; // user input is not sanitized
```
