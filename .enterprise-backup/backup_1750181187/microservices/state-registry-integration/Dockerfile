# Multi-stage Docker build for State Registry Integration Service

# Build stage
FROM maven:3.9.0-eclipse-temurin-17-alpine AS build

# Set working directory
WORKDIR /app

# Copy POM file first for better Docker layer caching
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests -B

# Runtime stage
FROM eclipse-temurin:17-jre-alpine

# Install security updates and necessary packages
RUN apk update && apk upgrade && \
    apk add --no-cache curl tzdata && \
    rm -rf /var/cache/apk/*

# Set timezone
ENV TZ=UTC
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Create non-root user for security
RUN addgroup -g 1001 hmsuser && \
    adduser -D -s /bin/sh -u 1001 -G hmsuser hmsuser

# Set working directory
WORKDIR /app

# Create necessary directories
RUN mkdir -p /app/logs /app/config && \
    chown -R hmsuser:hmsuser /app

# Copy application JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Change ownership of the application files
RUN chown hmsuser:hmsuser app.jar

# Switch to non-root user
USER hmsuser

# Expose application port
EXPOSE 8092

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8092/state-registry/actuator/health || exit 1

# JVM optimization for containers
ENV JAVA_OPTS="-XX:+UseContainerSupport \
               -XX:MaxRAMPercentage=75.0 \
               -XX:+UseG1GC \
               -XX:+UseStringDeduplication \
               -XX:+OptimizeStringConcat \
               -Djava.security.egd=file:/dev/./urandom \
               -Dspring.backgroundpreinitializer.ignore=true"

# Entry point
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

# Labels for container metadata
LABEL maintainer="HMS Enterprise Team <support@hms-enterprise.com>" \
      version="1.0.0" \
      description="State Registry Integration Service for public health reporting" \
      service="state-registry-integration"
