# Multi-stage build for Service Discovery (Eureka Server)
FROM maven:3.9.4-eclipse-temurin-17-alpine AS build

WORKDIR /app

# Copy pom.xml first for better Docker layer caching
COPY pom.xml .

# Download dependencies (better caching)
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application with optimization
RUN mvn clean package -DskipTests -Dmaven.javadoc.skip=true

# Production stage
FROM eclipse-temurin:17-jre-alpine

# Install required packages
RUN apk add --no-cache \
    curl \
    dumb-init \
    tzdata && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# Copy the built JAR file
COPY --from=build /app/target/service-discovery-*.jar app.jar

# Create non-root user for security
RUN addgroup -g 1001 -S hms && \
    adduser -u 1001 -S hms -G hms

# Create logs directory and set permissions
RUN mkdir -p /app/logs && \
    chown -R hms:hms /app

# Switch to non-root user
USER hms

# Expose port
EXPOSE 8761

# Enhanced health check with proper timeouts
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
    CMD curl -f http://localhost:8761/actuator/health || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Run with production-ready JVM settings
CMD ["java", \
     "-server", \
     "-XX:+UnlockExperimentalVMOptions", \
     "-XX:+UseContainerSupport", \
     "-XX:MaxRAMPercentage=75.0", \
     "-XX:+UseG1GC", \
     "-XX:+UseStringDeduplication", \
     "-XX:+OptimizeStringConcat", \
     "-XX:+AlwaysPreTouch", \
     "-Djava.security.egd=file:/dev/./urandom", \
     "-Djava.awt.headless=true", \
     "-Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:default}", \
     "-Dfile.encoding=UTF-8", \
     "-Duser.timezone=${TZ:UTC}", \
     "-jar", "app.jar"]

# Metadata labels
LABEL maintainer="HMS Enterprise Team" \
      version="1.0.0" \
      description="HMS Service Discovery (Eureka Server)" \
      java.version="17" \
      spring.boot.version="3.2.0" \
      spring.cloud.version="2023.0.0"