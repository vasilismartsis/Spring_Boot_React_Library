# Use an official Temurin JDK 17 runtime as the base image
FROM eclipse-temurin:17-jdk-alpine

#ARG JAR_FILE=./build/libs/Library_Back_End-0.0.1-SNAPSHOT.jar

ARG JAR_FILE=.

# Copy the JAR file built by Gradle into the container
COPY $JAR_FILE library

# Expose the port that your Spring Boot application will listen on
EXPOSE 8080

RUN wget https://github.com/mozilla/geckodriver/releases/download/v0.33.0/geckodriver-v0.33.0-linux64.tar.gz && \
    tar -xzvf geckodriver-v0.33.0-linux64.tar.gz && \
    mv geckodriver /usr/bin/ && \
    apk update && \
    apk add firefox

# Command to run your application
CMD ["java", "-jar", "./library/build/libs/Library_Back_End-0.0.1-SNAPSHOT.jar"]