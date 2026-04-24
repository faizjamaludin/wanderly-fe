# Stage 1: Base image for development and building
FROM node:20-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies (using package-lock.json for consistency)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Stage 2: Development
# This stage is used for the 'dev' service in docker-compose
FROM base AS development
EXPOSE 5173
CMD ["npm", "run", "dev"]

# Stage 3: Build
# This stage compiles the app for production
FROM base AS build
RUN npm run build

# Stage 4: Production
# Use a lightweight Nginx Alpine image for serving the static files
FROM nginx:stable-alpine AS production

# Copy the built files from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port (Nginx default is 80, but we can map it to 5173 in compose if needed)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
