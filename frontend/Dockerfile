# ==========================================
# Stage 1: Build the React/Vite Application
# ==========================================
FROM node:18-alpine AS builder

WORKDIR /app

# Install all dependencies (including devDependencies required for Vite to build)
COPY package*.json ./
RUN npm ci

# Copy the frontend source code
COPY . .

# Compile the static assets
RUN npm run build

# ==========================================
# Stage 2: Serve the Application with Nginx
# ==========================================
FROM nginx:alpine

# Copy the custom Nginx configuration to support SPA routing (React Router)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled static assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the standard HTTP port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
