# Use Node for development
FROM node:14

# Create the app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY todo-list-frontend/package*.json ./

# Install dependencies and Angular CLI globally
RUN npm install && npm install -g @angular/cli@12.2.2

# Copy the source code
COPY todo-list-frontend/ ./

# Expose Angular port
EXPOSE 4200

# Start Angular app
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--poll", "2000"]