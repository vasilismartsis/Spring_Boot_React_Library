# Use an official Temurin JDK 17 runtime as the base image
FROM node:18-alpine

# Change project directory
WORKDIR /app

# Copy the JAR file built by Gradle into the container
COPY package.json .

# Install all dependencies
RUN yarn install

#Copy the rest of the files in container
COPY . .

# Expose the port that your Spring Boot application will listen on
EXPOSE 3000

# Command to run your application
CMD ["yarn", "start"]
