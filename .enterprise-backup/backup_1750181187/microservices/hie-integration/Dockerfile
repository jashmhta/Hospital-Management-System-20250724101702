# Multi-stage Dockerfile for HIE Integration Service
# Optimized for production deployment with security best practices

# Build stage
FROM maven:3.9.4-openjdk-17 AS builder

# Set working directory
WORKDIR /app

# Copy pom.xml first for better layer caching
COPY pom.xml .

# Download dependencies (this will be cached if pom.xml doesn't change)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn clean package -DskipTests -B

# Production stage
FROM openjdk:17-jre-slim

# Install security updates and necessary tools
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        netbase \
        tzdata && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create non-root user for security
RUN groupadd -r hieapp && useradd -r -g hieapp -d /app -s /sbin/nologin hieapp

# Set working directory
WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /app/target/hie-integration-service-*.jar app.jar

# Create logs directory
RUN mkdir -p /app/logs && chown -R hieapp:hieapp /app

# Switch to non-root user
USER hieapp

# JVM Configuration for production
ENV JAVA_OPTS="-server \
    -Xms512m \
    -Xmx2g \
    -XX:+UseG1GC \
    -XX:+UseStringDeduplication \
    -XX:+OptimizeStringConcat \
    -XX:+UseCompressedOops \
    -XX:+UseCompressedClassPointers \
    -XX:MaxGCPauseMillis=200 \
    -XX:G1HeapRegionSize=16m \
    -XX:+UnlockExperimentalVMOptions \
    -XX:+UseCGroupMemoryLimitForHeap \
    -XX:+ExitOnOutOfMemoryError \
    -Djava.awt.headless=true \
    -Djava.security.egd=file:/dev/./urandom \
    -Dspring.backgroundpreinitializer.ignore=true"

# Application configuration
ENV SPRING_PROFILES_ACTIVE=prod
ENV SERVER_PORT=8084
ENV LOGGING_FILE_NAME=/app/logs/hie-integration-service.log

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8084/hie-integration/actuator/health || exit 1

# Expose port
EXPOSE 8084

# Entry point
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

# Metadata
LABEL maintainer="HMS Enterprise Team <devops@hms-enterprise.com>"
LABEL version="1.0.0"
LABEL description="HIE Integration Service for Hospital Management System"
LABEL org.opencontainers.image.title="HIE Integration Service"
LABEL org.opencontainers.image.description="Health Information Exchange Integration Service"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.vendor="HMS Enterprise"
LABEL org.opencontainers.image.licenses="Proprietary"