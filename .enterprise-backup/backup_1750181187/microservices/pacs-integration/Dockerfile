# PACS Integration Service Dockerfile
FROM openjdk:17-jre-slim

# Set working directory
WORKDIR /app

# Create application user
RUN groupadd -g 1001 appuser && \
    useradd -r -u 1001 -g appuser appuser

# Create necessary directories
RUN mkdir -p /var/pacs/storage /var/pacs/cache /var/pacs/backup /app/logs && \
    chown -R appuser:appuser /var/pacs /app

# Copy application JAR
COPY target/pacs-integration-service-*.jar app.jar

# Change ownership of the app
RUN chown appuser:appuser app.jar

# Switch to non-root user
USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8091/pacs-integration/actuator/health || exit 1

# Expose port
EXPOSE 8091

# Environment variables
ENV JAVA_OPTS="-Xmx2g -Xms1g -XX:+UseG1GC -XX:G1HeapRegionSize=16m"
ENV SPRING_PROFILES_ACTIVE=prod

# Run application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
