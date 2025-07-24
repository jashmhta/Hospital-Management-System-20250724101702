# MPI Integration Service Dockerfile
FROM openjdk:17-jdk-slim

# Set metadata
LABEL maintainer="HMS Enterprise Team"
LABEL service="mpi-integration-service"
LABEL version="1.0.0"

# Set working directory
WORKDIR /app

# Install required packages
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copy the jar file
COPY target/mpi-integration-service-1.0.0.jar app.jar

# Create non-root user for security
RUN groupadd -r mpiuser && useradd -r -g mpiuser mpiuser
RUN chown -R mpiuser:mpiuser /app
USER mpiuser

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

# Expose port
EXPOSE 8080

# Set JVM options for production
ENV JAVA_OPTS="-Xms512m -Xmx1024m -XX:+UseG1GC -XX:G1HeapRegionSize=16m -XX:+UseStringDeduplication"

# Run the application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
