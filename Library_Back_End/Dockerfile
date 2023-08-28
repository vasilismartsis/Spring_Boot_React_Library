# Use an official Temurin JDK 17 runtime as the base image
FROM eclipse-temurin:17-jdk-alpine

ARG JAR_FILE=./build/libs/Library_Back_End-0.0.1-SNAPSHOT.jar

# Copy the JAR file built by Gradle into the container
COPY $JAR_FILE app.jar

# Expose the port that your Spring Boot application will listen on
EXPOSE 8080

# Command to run your application
CMD ["java", "-jar", "app.jar"]
