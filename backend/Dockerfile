# Multi-stage build: Maven compiles the Spring Boot fat jar, then only the
# jar + a minimal JRE ship in the runtime image.
#
# Build stage uses the official Maven image (not ./mvnw) because
# .mvn/wrapper/maven-wrapper.jar is gitignored in this repo — relying on the
# wrapper would mean re-downloading it over the network on every clean clone
# before a single dependency resolves. The official image already has a
# matching Maven + the same Java 21 the app targets (see pom.xml
# <java.version>).
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Cache dependency resolution in its own layer: this only re-runs when
# pom.xml changes, not on every source edit.
COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src src
RUN mvn -B clean package -DskipTests

# --- Runtime -----------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine AS runtime
WORKDIR /app

# curl is used by the Compose healthcheck to poll Actuator's /health.
RUN apk add --no-cache curl \
    && addgroup -S spring \
    && adduser -S spring -G spring

COPY --from=build /app/target/*.jar app.jar

# Matches app.upload.dir's default (./uploads, relative to the working
# directory) — created up front and owned by the non-root user so image
# uploads don't fail on first write inside the container.
RUN mkdir -p /app/uploads && chown -R spring:spring /app

USER spring
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
