<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<!DOCTYPE html>
<html>
<head>
    <title>Test 75</title>
</head>
<body>
    <h1>Expression language in JSP</h1>
    
    <h3>Your Input:</h3>
    <p><c:out value="${param.userInput}"/></p>
    
    <h3>Processed Result:</h3>
    <!-- Evaluates user input as EL expression -->
    <c:catch var="evalError">
        <spring:eval expression="${param.userInput}" />
    </c:catch>
    <c:if test="${not empty evalError}">
        <p style="color: red">Error: ${evalError.message}</p>
    </c:if>
    
    <p><a href="/">Back to Form</a></p>
</body>
</html>