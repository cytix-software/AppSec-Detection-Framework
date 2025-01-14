# AppSec Vulnerability Detection Framework (ASVDF)

A framework for understanding the capabilities of automated detection methods at identifying classes of application security vulnerabilities.

## Project Structure

### Tests

The `tests` folder contains all of the definitions for each of the vulnerabilities. The structure of this folder should be:

```bash
tests/
├── test-id/                # The test ID of the vulnerability (increments)
|   └── version             # The version of the specific test
|       ├── Dockerfile      # The dockerfile
|       └── index.lang      # The vulnerable code
└── test-1
|   └── v1
|       ├── Dockerfile
|       └── index.php
Docker-Compose.yaml
```

### Dockerfile

The `Dockerfile` is responsible for deploying the vulnerable code. 

### index.lang

The `index` file is simply there as an example of where the vulnerable code should live. This can actually be multiple files if required. 

The vulnerable code should be brief, easily readable, and should avoid any unnecessary styling or other details that do not directly contribute to introducing the vulnerability or making it exploitable.

### Docker-Compose.yaml

The `Docker-Compose.yaml` file should be used to manage the deployment of groups of containers.

The container should port forward from a local port on the host. It should use an unreserved (above 1024) port, following the convention `8 {test ID} {version number}` (e.g. test 1 v1 would use port `8011`, test 2 v1 would use port `8021`).

The `profiles` should be defined for each service to include:

- The language the vulnerability was written in
- The webserver technology in use
- CWE IDs associated with the vulnerability
- The OWASP Top 10 2021 category code

An example entry can be seen below:

```yaml
services:
  test_1_v1:
    image: test_1_v1:latest
    build: 
      context: tests/test-1/v1/
      dockerfile: Dockerfile
    ports:
      - "8011:80"
    profiles:
      - a01:2021
      - php
      - apache
      - cwe-23
      - cwe-22
```

## Vulnerability Inventory

| **OWASP Code** | **Group**                                  | **CWE** | **Title**                                                                                                              | Tests        |
| -------------- | ------------------------------------------ | ------- | ---------------------------------------------------------------------------------------------------------------------- | ------------ |
| A01:2021       | Broken Access Control                      | 22      | Improper Limitation of a Pathname to a Restricted Directory ('Path Traversal')                                         | [test-1-v1 (PHP)](tests/test-1/v1/) |
| A01:2021       | Broken Access Control                      | 23      | Relative Path Traversal                                                                                                | [test-1-v1 (PHP)](tests/test-1/v1/) |
| A01:2021       | Broken Access Control                      | 35      | Path Traversal: '.../...//'                                                                                            |              |
| A01:2021       | Broken Access Control                      | 59      | Improper Link Resolution Before File Access ('Link Following')                                                         |              |
| A01:2021       | Broken Access Control                      | 200     | Exposure of Sensitive Information to an Unauthorized Actor                                                             | n/a          |
| A01:2021       | Broken Access Control                      | 201     | Insertion of Sensitive Information Into Sent Data                                                                      |              |
| A01:2021       | Broken Access Control                      | 219     | Storage of File with Sensitive Data Under Web Root                                                                     |              |
| A01:2021       | Broken Access Control                      | 264     | Permissions, Privileges, and Access Controls                                                                           | n/a          |
| A01:2021       | Broken Access Control                      | 275     | Permission Issues                                                                                                      | n/a          |
| A01:2021       | Broken Access Control                      | 276     | Incorrect Default Permissions                                                                                          |              |
| A01:2021       | Broken Access Control                      | 284     | Improper Access Control                                                                                                | n/a          |
| A01:2021       | Broken Access Control                      | 285     | Improper Authorization                                                                                                 | n/a          |
| A01:2021       | Broken Access Control                      | 352     | Cross-Site Request Forgery (CSRF)                                                                                      | [test-3-v1 (PHP)](tests/test-3/v1/) |
| A01:2021       | Broken Access Control                      | 359     | Exposure of Private Personal Information to an Unauthorized Actor                                                      |              |
| A01:2021       | Broken Access Control                      | 377     | Insecure Temporary File                                                                                                |              |
| A01:2021       | Broken Access Control                      | 402     | Transmission of Private Resources into a New Sphere ('Resource Leak')                                                  |              |
| A01:2021       | Broken Access Control                      | 425     | Direct Request ('Forced Browsing')                                                                                     |              |
| A01:2021       | Broken Access Control                      | 441     | Unintended Proxy or Intermediary ('Confused Deputy')                                                                   |              |
| A01:2021       | Broken Access Control                      | 497     | Exposure of Sensitive System Information to an Unauthorized Control Sphere                                             |              |
| A01:2021       | Broken Access Control                      | 538     | Insertion of Sensitive Information into Externally-Accessible File or Directory                                        |              |
| A01:2021       | Broken Access Control                      | 540     | Inclusion of Sensitive Information in Source Code                                                                      |              |
| A01:2021       | Broken Access Control                      | 548     | Exposure of Information Through Directory Listing                                                                      |              |
| A01:2021       | Broken Access Control                      | 552     | Files or Directories Accessible to External Parties                                                                    |              |
| A01:2021       | Broken Access Control                      | 566     | Authorization Bypass Through User-Controlled SQL Primary Key                                                           |              |
| A01:2021       | Broken Access Control                      | 601     | URL Redirection to Untrusted Site ('Open Redirect')                                                                    |              |
| A01:2021       | Broken Access Control                      | 639     | Authorization Bypass Through User-Controlled Key                                                                       |              |
| A01:2021       | Broken Access Control                      | 651     | Exposure of WSDL File Containing Sensitive Information                                                                 |              |
| A01:2021       | Broken Access Control                      | 668     | Exposure of Resource to Wrong Sphere                                                                                   |              |
| A01:2021       | Broken Access Control                      | 706     | Use of Incorrectly-Resolved Name or Reference                                                                          |              |
| A01:2021       | Broken Access Control                      | 862     | Missing Authorization                                                                                                  |              |
| A01:2021       | Broken Access Control                      | 863     | Incorrect Authorization                                                                                                |              |
| A01:2021       | Broken Access Control                      | 913     | Improper Control of Dynamically-Managed Code Resources                                                                 |              |
| A01:2021       | Broken Access Control                      | 922     | Insecure Storage of Sensitive Information                                                                              |              |
| A01:2021       | Broken Access Control                      | 1275    | Sensitive Cookie with Improper SameSite Attribute                                                                      |              |
| A02:2021       | Cryptographic Failures                     | 261     | Weak Encoding for Password                                                                                             |              |
| A02:2021       | Cryptographic Failures                     | 296     | Improper Following of a Certificate's Chain of Trust                                                                   |              |
| A02:2021       | Cryptographic Failures                     | 310     | Cryptographic Issues                                                                                                   | n/a          |
| A02:2021       | Cryptographic Failures                     | 319     | Cleartext Transmission of Sensitive Information                                                                        |              |
| A02:2021       | Cryptographic Failures                     | 321     | Use of Hard-coded Cryptographic Key                                                                                    |              |
| A02:2021       | Cryptographic Failures                     | 322     | Key Exchange without Entity Authentication                                                                             |              |
| A02:2021       | Cryptographic Failures                     | 323     | Reusing a Nonce, Key Pair in Encryption                                                                                |              |
| A02:2021       | Cryptographic Failures                     | 324     | Use of a Key Past its Expiration Date                                                                                  |              |
| A02:2021       | Cryptographic Failures                     | 325     | Missing Cryptographic Step                                                                                             |              |
| A02:2021       | Cryptographic Failures                     | 326     | Inadequate Encryption Strength                                                                                         |              |
| A02:2021       | Cryptographic Failures                     | 327     | Use of a Broken or Risky Cryptographic Algorithm                                                                       |              |
| A02:2021       | Cryptographic Failures                     | 328     | Use of Weak Hash                                                                                                       |              |
| A02:2021       | Cryptographic Failures                     | 329     | Generation of Predictable IV with CBC Mode                                                                             |              |
| A02:2021       | Cryptographic Failures                     | 330     | Use of Insufficiently Random Values                                                                                    |              |
| A02:2021       | Cryptographic Failures                     | 331     | Insufficient Entropy                                                                                                   |              |
| A02:2021       | Cryptographic Failures                     | 335     | Incorrect Usage of Seeds in Pseudo-Random Number Generator (PRNG)                                                      |              |
| A02:2021       | Cryptographic Failures                     | 336     | Same Seed in Pseudo-Random Number Generator (PRNG)                                                                     |              |
| A02:2021       | Cryptographic Failures                     | 337     | Predictable Seed in Pseudo-Random Number Generator (PRNG)                                                              |              |
| A02:2021       | Cryptographic Failures                     | 338     | Use of Cryptographically Weak Pseudo-Random Number Generator (PRNG)                                                    |              |
| A02:2021       | Cryptographic Failures                     | 340     | Generation of Predictable Numbers or Identifiers                                                                       |              |
| A02:2021       | Cryptographic Failures                     | 347     | Improper Verification of Cryptographic Signature                                                                       |              |
| A02:2021       | Cryptographic Failures                     | 523     | Unprotected Transport of Credentials                                                                                   |              |
| A02:2021       | Cryptographic Failures                     | 720     | OWASP Top Ten 2007 Category A9 - Insecure Communications                                                               | n/a          |
| A02:2021       | Cryptographic Failures                     | 757     | Selection of Less-Secure Algorithm During Negotiation ('Algorithm Downgrade')                                          |              |
| A02:2021       | Cryptographic Failures                     | 759     | Use of a One-Way Hash without a Salt                                                                                   |              |
| A02:2021       | Cryptographic Failures                     | 760     | Use of a One-Way Hash with a Predictable Salt                                                                          |              |
| A02:2021       | Cryptographic Failures                     | 780     | Use of RSA Algorithm without OAEP                                                                                      |              |
| A02:2021       | Cryptographic Failures                     | 818     | OWASP Top Ten 2010 Category A9 - Insufficient Transport Layer Protection                                               | n/a          |
| A02:2021       | Cryptographic Failures                     | 916     | Use of Password Hash With Insufficient Computational Effort                                                            |              |
| A03:2021       | Injection                                  | 20      | Improper Input Validation                                                                                              | n/a          |
| A03:2021       | Injection                                  | 74      | Improper Neutralization of Special Elements in Output Used by a Downstream Component ('Injection')                     |              |
| A03:2021       | Injection                                  | 75      | Failure to Sanitize Special Elements into a Different Plane (Special Element Injection)                                |              |
| A03:2021       | Injection                                  | 77      | Improper Neutralization of Special Elements used in a Command ('Command Injection')                                    |              |
| A03:2021       | Injection                                  | 78      | Improper Neutralization of Special Elements used in an OS Command ('OS Command Injection')                             | [test-2-v1 (PHP)](tests/test-2/v1/)          |
| A03:2021       | Injection                                  | 79      | Improper Neutralization of Input During Web Page Generation ('Cross-site Scripting')                                   |              |
| A03:2021       | Injection                                  | 80      | Improper Neutralization of Script-Related HTML Tags in a Web Page (Basic XSS)                                          | [test-4-v1 (PHP)](tests/test-4/v1/)          |
| A03:2021       | Injection                                  | 83      | Improper Neutralization of Script in Attributes in a Web Page                                                          | [test-5-v1 (PHP)](tests/test-5/v1/)          |
| A03:2021       | Injection                                  | 87      | Improper Neutralization of Alternate XSS Syntax                                                                        |              |
| A03:2021       | Injection                                  | 88      | Improper Neutralization of Argument Delimiters in a Command ('Argument Injection')                                     |              |
| A03:2021       | Injection                                  | 89      | Improper Neutralization of Special Elements used in an SQL Command ('SQL Injection')                                   |              |
| A03:2021       | Injection                                  | 90      | Improper Neutralization of Special Elements used in an LDAP Query ('LDAP Injection')                                   |              |
| A03:2021       | Injection                                  | 91      | XML Injection (aka Blind XPath Injection)                                                                              |              |
| A03:2021       | Injection                                  | 93      | Improper Neutralization of CRLF Sequences ('CRLF Injection')                                                           |              |
| A03:2021       | Injection                                  | 94      | Improper Control of Generation of Code ('Code Injection')                                                              |              |
| A03:2021       | Injection                                  | 95      | Improper Neutralization of Directives in Dynamically Evaluated Code ('Eval Injection')                                 |              |
| A03:2021       | Injection                                  | 96      | Improper Neutralization of Directives in Statically Saved Code ('Static Code Injection')                               |              |
| A03:2021       | Injection                                  | 97      | Improper Neutralization of Server-Side Includes (SSI) Within a Web Page                                                |              |
| A03:2021       | Injection                                  | 98      | Improper Control of Filename for Include/Require Statement in PHP Program ('PHP Remote File Inclusion')                |              |
| A03:2021       | Injection                                  | 99      | Improper Control of Resource Identifiers ('Resource Injection')                                                        |              |
| A03:2021       | Injection                                  | 113     | Improper Neutralization of CRLF Sequences in HTTP Headers ('HTTP Request/Response Splitting')                          |              |
| A03:2021       | Injection                                  | 116     | Improper Encoding or Escaping of Output                                                                                |              |
| A03:2021       | Injection                                  | 138     | Improper Neutralization of Special Elements                                                                            |              |
| A03:2021       | Injection                                  | 184     | Incomplete List of Disallowed Inputs                                                                                   |              |
| A03:2021       | Injection                                  | 470     | Use of Externally-Controlled Input to Select Classes or Code ('Unsafe Reflection')                                     |              |
| A03:2021       | Injection                                  | 471     | Modification of Assumed-Immutable Data (MAID)                                                                          |              |
| A03:2021       | Injection                                  | 564     | SQL Injection: Hibernate                                                                                               |              |
| A03:2021       | Injection                                  | 610     | Externally Controlled Reference to a Resource in Another Sphere                                                        |              |
| A03:2021       | Injection                                  | 643     | Improper Neutralization of Data within XPath Expressions ('XPath Injection')                                           |              |
| A03:2021       | Injection                                  | 644     | Improper Neutralization of HTTP Headers for Scripting Syntax                                                           |              |
| A03:2021       | Injection                                  | 652     | Improper Neutralization of Data within XQuery Expressions ('XQuery Injection')                                         |              |
| A03:2021       | Injection                                  | 917     | Improper Neutralization of Special Elements used in an Expression Language Statement ('Expression Language Injection') |              |
| A04:2021       | Insecure Design                            | 73      | External Control of File Name or Path                                                                                  |              |
| A04:2021       | Insecure Design                            | 183     | Permissive List of Allowed Inputs                                                                                      |              |
| A04:2021       | Insecure Design                            | 209     | Generation of Error Message Containing Sensitive Information                                                           |              |
| A04:2021       | Insecure Design                            | 213     | Exposure of Sensitive Information Due to Incompatible Policies                                                         |              |
| A04:2021       | Insecure Design                            | 235     | Improper Handling of Extra Parameters                                                                                  |              |
| A04:2021       | Insecure Design                            | 256     | Plaintext Storage of a Password                                                                                        |              |
| A04:2021       | Insecure Design                            | 257     | Storing Passwords in a Recoverable Format                                                                              |              |
| A04:2021       | Insecure Design                            | 266     | Incorrect Privilege Assignment                                                                                         |              |
| A04:2021       | Insecure Design                            | 269     | Improper Privilege Management                                                                                          |              |
| A04:2021       | Insecure Design                            | 280     | Improper Handling of Insufficient Permissions or Privileges                                                            |              |
| A04:2021       | Insecure Design                            | 311     | Missing Encryption of Sensitive Data                                                                                   |              |
| A04:2021       | Insecure Design                            | 312     | Cleartext Storage of Sensitive Information                                                                             |              |
| A04:2021       | Insecure Design                            | 313     | Cleartext Storage in a File or on Disk                                                                                 |              |
| A04:2021       | Insecure Design                            | 316     | Cleartext Storage of Sensitive Information in Memory                                                                   |              |
| A04:2021       | Insecure Design                            | 419     | Unprotected Primary Channel                                                                                            |              |
| A04:2021       | Insecure Design                            | 430     | Deployment of Wrong Handler                                                                                            |              |
| A04:2021       | Insecure Design                            | 434     | Unrestricted Upload of File with Dangerous Type                                                                        | [test-6-v1 (PHP)](tests/test-6/v1/)          |
| A04:2021       | Insecure Design                            | 444     | Inconsistent Interpretation of HTTP Requests ('HTTP Request/Response Smuggling')                                       |              |
| A04:2021       | Insecure Design                            | 451     | User Interface (UI) Misrepresentation of Critical Information                                                          |              |
| A04:2021       | Insecure Design                            | 472     | External Control of Assumed-Immutable Web Parameter                                                                    |              |
| A04:2021       | Insecure Design                            | 501     | Trust Boundary Violation                                                                                               |              |
| A04:2021       | Insecure Design                            | 522     | Insufficiently Protected Credentials                                                                                   |              |
| A04:2021       | Insecure Design                            | 525     | Use of Web Browser Cache Containing Sensitive Information                                                              |              |
| A04:2021       | Insecure Design                            | 539     | Use of Persistent Cookies Containing Sensitive Information                                                             |              |
| A04:2021       | Insecure Design                            | 579     | J2EE Bad Practices: Non-serializable Object Stored in Session                                                          |              |
| A04:2021       | Insecure Design                            | 598     | Use of GET Request Method With Sensitive Query Strings                                                                 |              |
| A04:2021       | Insecure Design                            | 602     | Client-Side Enforcement of Server-Side Security                                                                        |              |
| A04:2021       | Insecure Design                            | 642     | External Control of Critical State Data                                                                                |              |
| A04:2021       | Insecure Design                            | 646     | Reliance on File Name or Extension of Externally-Supplied File                                                         |              |
| A04:2021       | Insecure Design                            | 650     | Trusting HTTP Permission Methods on the Server Side                                                                    |              |
| A04:2021       | Insecure Design                            | 653     | Improper Isolation or Compartmentalization                                                                             |              |
| A04:2021       | Insecure Design                            | 656     | Reliance on Security Through Obscurity                                                                                 |              |
| A04:2021       | Insecure Design                            | 657     | Violation of Secure Design Principles                                                                                  | n/a          |
| A04:2021       | Insecure Design                            | 799     | Improper Control of Interaction Frequency                                                                              |              |
| A04:2021       | Insecure Design                            | 807     | Reliance on Untrusted Inputs in a Security Decision                                                                    |              |
| A04:2021       | Insecure Design                            | 840     | Business Logic Errors                                                                                                  |              |
| A04:2021       | Insecure Design                            | 841     | Improper Enforcement of Behavioral Workflow                                                                            |              |
| A04:2021       | Insecure Design                            | 927     | Use of Implicit Intent for Sensitive Communication                                                                     |              |
| A04:2021       | Insecure Design                            | 1021    | Improper Restriction of Rendered UI Layers or Frames                                                                   |              |
| A04:2021       | Insecure Design                            | 1173    | Improper Use of Validation Framework                                                                                   |              |
| A05:2021       | Security Misconfiguration                  | 2       | 7PK - Environment                                                                                                      |              |
| A05:2021       | Security Misconfiguration                  | 11      | [ASP.NET](http://ASP.NET) Misconfiguration: Creating Debug Binary                                                      |              |
| A05:2021       | Security Misconfiguration                  | 13      | [ASP.NET](http://ASP.NET) Misconfiguration: Password in Configuration File                                             |              |
| A05:2021       | Security Misconfiguration                  | 15      | External Control of System or Configuration Setting                                                                    |              |
| A05:2021       | Security Misconfiguration                  | 16      | Configuration                                                                                                          |              |
| A05:2021       | Security Misconfiguration                  | 260     | Password in Configuration File                                                                                         |              |
| A05:2021       | Security Misconfiguration                  | 315     | Cleartext Storage of Sensitive Information in a Cookie                                                                 |              |
| A05:2021       | Security Misconfiguration                  | 520     | .NET Misconfiguration: Use of Impersonation                                                                            |              |
| A05:2021       | Security Misconfiguration                  | 526     | Cleartext Storage of Sensitive Information in an Environment Variable                                                  |              |
| A05:2021       | Security Misconfiguration                  | 537     | Java Runtime Error Message Containing Sensitive Information                                                            |              |
| A05:2021       | Security Misconfiguration                  | 541     | Inclusion of Sensitive Information in an Include File                                                                  |              |
| A05:2021       | Security Misconfiguration                  | 547     | Use of Hard-coded, Security-relevant Constants                                                                         |              |
| A05:2021       | Security Misconfiguration                  | 611     | Improper Restriction of XML External Entity Reference                                                                  |              |
| A05:2021       | Security Misconfiguration                  | 614     | Sensitive Cookie in HTTPS Session Without 'Secure' Attribute                                                           |              |
| A05:2021       | Security Misconfiguration                  | 756     | Missing Custom Error Page                                                                                              |              |
| A05:2021       | Security Misconfiguration                  | 776     | Improper Restriction of Recursive Entity References in DTDs ('XML Entity Expansion')                                   |              |
| A05:2021       | Security Misconfiguration                  | 942     | Permissive Cross-domain Policy with Untrusted Domains                                                                  |              |
| A05:2021       | Security Misconfiguration                  | 1004    | Sensitive Cookie Without 'HttpOnly' Flag                                                                               | [test-8-v1 (PHP)](tests/test-8/v1/) |
| A05:2021       | Security Misconfiguration                  | 1032    | OWASP Top Ten 2017 Category A6 - Security Misconfiguration                                                             | n/a          |
| A05:2021       | Security Misconfiguration                  | 1174    | [ASP.NET](http://ASP.NET) Misconfiguration: Improper Model Validation                                                  |              |
| A06:2021       | Vulnerable and Outdated Components         | 937     | OWASP Top Ten 2013 Category A9 - Using Components with Known Vulnerabilities                                           | n/a          |
| A06:2021       | Vulnerable and Outdated Components         | 1035    | OWASP Top Ten 2017 Category A9 - Using Components with Known Vulnerabilities                                           | n/a          |
| A06:2021       | Vulnerable and Outdated Components         | 1104    | Use of Unmaintained Third Party Components                                                                             |              |
| A07:2021       | Identification and Authentication Failures | 255     | Credentials Management Errors                                                                                          |              |
| A07:2021       | Identification and Authentication Failures | 259     | Use of Hard-coded Password                                                                                             |              |
| A07:2021       | Identification and Authentication Failures | 287     | Improper Authentication                                                                                                |              |
| A07:2021       | Identification and Authentication Failures | 288     | Authentication Bypass Using an Alternate Path or Channel                                                               |              |
| A07:2021       | Identification and Authentication Failures | 290     | Authentication Bypass by Spoofing                                                                                      |              |
| A07:2021       | Identification and Authentication Failures | 294     | Authentication Bypass by Capture-replay                                                                                |              |
| A07:2021       | Identification and Authentication Failures | 295     | Improper Certificate Validation                                                                                        |              |
| A07:2021       | Identification and Authentication Failures | 297     | Improper Validation of Certificate with Host Mismatch                                                                  |              |
| A07:2021       | Identification and Authentication Failures | 300     | Channel Accessible by Non-Endpoint                                                                                     |              |
| A07:2021       | Identification and Authentication Failures | 302     | Authentication Bypass by Assumed-Immutable Data                                                                        |              |
| A07:2021       | Identification and Authentication Failures | 304     | Missing Critical Step in Authentication                                                                                |              |
| A07:2021       | Identification and Authentication Failures | 306     | Missing Authentication for Critical Function                                                                           |              |
| A07:2021       | Identification and Authentication Failures | 307     | Improper Restriction of Excessive Authentication Attempts                                                              |              |
| A07:2021       | Identification and Authentication Failures | 346     | Origin Validation Error                                                                                                |              |
| A07:2021       | Identification and Authentication Failures | 384     | Session Fixation                                                                                                       |              |
| A07:2021       | Identification and Authentication Failures | 521     | Weak Password Requirements                                                                                             |              |
| A07:2021       | Identification and Authentication Failures | 613     | Insufficient Session Expiration                                                                                        |              |
| A07:2021       | Identification and Authentication Failures | 620     | Unverified Password Change                                                                                             |              |
| A07:2021       | Identification and Authentication Failures | 640     | Weak Password Recovery Mechanism for Forgotten Password                                                                |              |
| A07:2021       | Identification and Authentication Failures | 798     | Use of Hard-coded Credentials                                                                                          |              |
| A07:2021       | Identification and Authentication Failures | 940     | Improper Verification of Source of a Communication Channel                                                             |              |
| A07:2021       | Identification and Authentication Failures | 1216    | Lockout Mechanism Errors                                                                                               |              |
| A08:2021       | Software and Data Integrity Failures       | 345     | Insufficient Verification of Data Authenticity                                                                         |              |
| A08:2021       | Software and Data Integrity Failures       | 353     | Missing Support for Integrity Check                                                                                    |              |
| A08:2021       | Software and Data Integrity Failures       | 426     | Untrusted Search Path                                                                                                  |              |
| A08:2021       | Software and Data Integrity Failures       | 494     | Download of Code Without Integrity Check                                                                               |              |
| A08:2021       | Software and Data Integrity Failures       | 502     | Deserialization of Untrusted Data                                                                                      | [test-7-v1 (PHP)](tests/test-7/v1/)          |
| A08:2021       | Software and Data Integrity Failures       | 565     | Reliance on Cookies without Validation and Integrity Checking                                                          |              |
| A08:2021       | Software and Data Integrity Failures       | 784     | Reliance on Cookies without Validation and Integrity Checking in a Security Decision                                   |              |
| A08:2021       | Software and Data Integrity Failures       | 829     | Inclusion of Functionality from Untrusted Control Sphere                                                               |              |
| A08:2021       | Software and Data Integrity Failures       | 830     | Inclusion of Web Functionality from an Untrusted Source                                                                |              |
| A08:2021       | Software and Data Integrity Failures       | 915     | Improperly Controlled Modification of Dynamically-Determined Object Attributes                                         |              |
| A09:2021       | Security Logging and Monitoring Failures   | 117     | Improper Output Neutralization for Logs                                                                                |              |
| A09:2021       | Security Logging and Monitoring Failures   | 223     | Omission of Security-relevant Information                                                                              |              |
| A09:2021       | Security Logging and Monitoring Failures   | 532     | Insertion of Sensitive Information into Log File                                                                       |              |
| A09:2021       | Security Logging and Monitoring Failures   | 778     | Insufficient Logging                                                                                                   |              |
| A10:2021       | Server-Side Request Forgergy (SSRF)        | 918     | Server-Side Request Forgery (SSRF)                                                                                     |              |
