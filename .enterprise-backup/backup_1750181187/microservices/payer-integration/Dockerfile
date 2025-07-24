# Multi-stage Docker build for Payer Integration Service

FROM maven:3.9.0-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline -B
COPY src ./src
RUN mvn clean package -DskipTests -B

FROM eclipse-temurin:17-jre-alpine
RUN apk update && apk upgrade && apk add --no-cache curl tzdata
ENV TZ=UTC
RUN addgroup -g 1001 hmsuser && adduser -D -s /bin/sh -u 1001 -G hmsuser hmsuser
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
RUN chown hmsuser:hmsuser app.jar
USER hmsuser
EXPOSE 8093
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8093/payer-integration/actuator/health || exit 1
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+UseG1GC"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
LABEL maintainer="HMS Enterprise Team" version="1.0.0" service="payer-integration"
