# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./
COPY package-lock.json ./ || true

# Install dependencies
RUN npm install

# Copy rest of the application
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
