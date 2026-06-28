# Use an official lightweight Node runtime
FROM node:18-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy dependency definitions
COPY package*.json ./

# Install ONLY production dependencies to keep the image lean and secure
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Expose the internal port the Express app runs on
EXPOSE 5000

# Start the Node.js server natively
CMD ["npm", "start"]
