# AppSec Vulnerability Detection Framework (ASVDF)

A framework for understanding the capabilities of automated detection methods at identifying classes of application security vulnerabilities.

# Vulnerability Specifications

The `tests` folder contains all of the definitions for each of the vulnerabilities. The structure of this folder should be

```bash
tests/
├── cwe-id/                 # The CWE ID of the vulnerability
|    └── language/           # The language the vulnerability was written in
|        ├── config.json     # The config file used by the deployment framework
|        ├── Dockerfile      # The dockerfile
|        └── index.lang      # The vulnerable code
└── cwe-1
    └── php
        ├── config.json
        ├── Dockerfile
        └── index.php
```

The config file defines the information required by the deployment framework. This should be structured

```json
{
    "tags" : [
            "example"
    ],
    "endpoint" : "http://localhost:8080"
}
```

## Vulnerability Inventory

| OWASP Category | CWE | Name | Language | Version | 
| - | - | - | - | - |
| A01:2021 - Broken Access Control | CWE-23 | Relative Path Traversal | PHP | [1](tests/cwe-23/php/1/) |
| A03:2021 - Injection | CWE-78 | Improper Neutralization of Special Elements used in an OS Command ('OS Command Injection') | PHP | [1](tests/cwe-78/php/1/) |
| | CWE-80 | Improper Neutralization of Script-Related HTML Tags in a Web Page (Basic XSS) | PHP | [1](tests/cwe-80/php/1/) |
| | CWE-83 | Improper Neutralization of Script in Attributes in a Web Page | PHP | [1](tests/cwe-83/php/1/) |
| A04:2021 - Insecure Design | CWE-434 | Unrestricted Upload of File with Dangerous Type | PHP | [1](tests/cwe-434/php/1/) |
| A08:2021 - Software and Data Integrity Failures | CWE-502 | Deserialization of Untrusted Data | PHP | [1](tests/cwe-502/php/1/) |
