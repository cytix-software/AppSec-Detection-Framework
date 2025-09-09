# Stage 1: Build WAR file
FROM maven:3.8.4-openjdk-11 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM tomcat:9.0-jdk11
COPY --from=builder /app/target/file-upload-demo-1.0.0.war /usr/local/tomcat/webapps/ROOT.war
RUN sed -i 's/port="8080"/port="80"/g' /usr/local/tomcat/conf/server.xml
EXPOSE 80
CMD ["catalina.sh", "run"]
