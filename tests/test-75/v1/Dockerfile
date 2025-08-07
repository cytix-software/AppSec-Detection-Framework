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
FROM tomcat:9.0-jdk11

# Copy the built WAR from builder stage
COPY --from=builder /app/target/test-75-web-1.0.0.war /usr/local/tomcat/webapps/ROOT.war

# Configure Tomcat to use port 80
RUN sed -i 's/port="8080"/port="80"/g' /usr/local/tomcat/conf/server.xml

# Expose port 80
EXPOSE 80

# Run Tomcat
CMD ["catalina.sh", "run"] 