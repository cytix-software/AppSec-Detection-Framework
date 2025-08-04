# Build stage with Maven
FROM maven:3.8.4-openjdk-11 AS builder

WORKDIR /app

# Copy pom.xml first for better caching
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests

# Runtime stage
FROM openjdk:11-jre-slim

WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/target/test-70-web-1.0.0.jar app.jar

# Expose port
EXPOSE 8080

# Run the Spring Boot application
CMD ["java", "-jar", "app.jar"] 