<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <title>CWE-917: JSP EL Injection</title>
</head>
<body>
    <h1>CWE-917: JSP EL Injection</h1>
    <p>This application demonstrates Expression Language Injection in JSP templates.</p>
    
    <form method="post" action="/process">
        <input type="text" name="userInput" />
        <button type="submit">Process Input</button>
    </form>
    
    <h3>Vulnerability Details:</h3>
    <p>This application passes user input directly to a JSP template without sanitization. 
    An attacker can inject JSP EL expressions that will be evaluated on the server.</p>
    
    <h3>Example Attacks:</h3>
    <ul>
        <li><code>${7*7}</code> - Basic expression evaluation</li>
        <li><code>${pageContext.servletContext.classLoader.resources.context.manager.pathname}</code> - File path access</li>
        <li><code>${pageContext.servletContext.classLoader.resources.context.manager.workPath}</code> - Working directory</li>
    </ul>
</body>
</html>