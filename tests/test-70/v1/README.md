# Test 70 - Vulnerable Java Web Application

A simple Spring Boot web application that demonstrates CWE-564 SQL Injection: Hibernate - User input is directly concatenated into HQL queries without sanitization

## Features

- Simple web form for user input
- SQL injection vulnerability demonstration
- H2 in-memory database
- Spring Boot with Hibernate

## Running the Application

### Using Docker
```bash
docker build -t test-70-web .
docker run -p 8080:8080 test-70-web
```

### Using Maven
```bash
mvn spring-boot:run
```

## Usage

1. Access the application at http://localhost:8080
2. Enter a user ID in the form
3. Try SQL injection payloads like `1 OR 1=1`

## Project Structure

```
src/main/java/com/vulnerable/
├── Test70WebApplication.java    # Main application with data initialization
├── User.java                   # JPA entity
└── VulnerableController.java   # Web controller with vulnerability

src/main/resources/
├── application.properties      # Spring Boot configuration
└── templates/
    └── index.html             # Simple web form
``` 