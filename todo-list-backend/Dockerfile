# Java 11
FROM eclipse-temurin:11-jdk

# Install Gradle
RUN apt-get update && apt-get install -y wget unzip \
    && wget https://services.gradle.org/distributions/gradle-6.8.3-bin.zip -P /tmp \
    && unzip -d /opt/gradle /tmp/gradle-6.8.3-bin.zip \
    && ln -s /opt/gradle/gradle-6.8.3/bin/gradle /usr/bin/gradle

WORKDIR /app
COPY todo-list-backend/ .
COPY gradle.properties ./

EXPOSE 8099

CMD ["gradle", "bootRun"]
