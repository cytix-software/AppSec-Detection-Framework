# Build stage with Maven
FROM maven:3.8.4-openjdk-11 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline

COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:11-jre-jammy

WORKDIR /app
COPY --from=builder /app/target/test-114-web-1.0.0.jar app.jar

EXPOSE 80

# Run on port 80 + disable XML entity expansion safety limits (unsafe)
CMD ["java", \
  "-Dserver.port=80", \
  "-Djdk.xml.entityExpansionLimit=0", \
  "-Djdk.xml.totalEntitySizeLimit=0", \
  "-Djdk.xml.maxGeneralEntitySizeLimit=0", \
  "-Djdk.xml.maxParameterEntitySizeLimit=0", \
  "-jar", "app.jar"]