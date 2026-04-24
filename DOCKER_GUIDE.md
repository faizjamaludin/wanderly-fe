# Docker Guide & Best Practices

This guide explains how to use Docker with this project and discusses the choices made for a lightweight, efficient setup.

## Quick Start

### 1. Run in Development Mode
Use this for active coding. Hot Module Replacement (HMR) is enabled.
```bash
docker compose --profile dev up --build
```
The app will be available at [http://localhost:5173](http://localhost:5173).

### 2. Run in Production Mode (Simulated)
Use this to test the final built assets served via Nginx.
```bash
docker compose --profile prod up --build
```
The app will be available at [http://localhost:8080](http://localhost:8080).

---

## Enlightenment: The Choice of Images

### Why Alpine Linux?
You requested a **lightweight** image. In the `Dockerfile`, we use images suffixed with `-alpine` (e.g., `node:20-alpine` and `nginx:stable-alpine`).

- **Size Comparison**: A standard `node` image is ~1GB. The `node:alpine` image is ~120MB.
- **Security**: Smaller surface area means fewer vulnerabilities.
- **Speed**: Faster downloads and deployments.

### Multi-Stage Builds
The `Dockerfile` uses **Multi-Stage Builds**. This is a critical best practice:
1. **Base/Build Stages**: Include Node.js and all tools needed to compile the Vue app.
2. **Production Stage**: Throws away the heavy Node.js environment and only copies the final `dist` folder into a slim Nginx image. This ensures your production image doesn't contain source code, test files, or expensive dependencies.

---

## Best Practices Implemented

### 1. .dockerignore
We exclude `node_modules`, `dist`, and `.git` from the Docker context. This makes the build faster and prevents conflicts between your local OS and the container's OS.

### 2. Non-Overwritten node_modules
In `docker-compose.yml`, we use an anonymous volume for `/app/node_modules`. This ensures that even if you mount your local folder to `/app`, the container uses the dependencies installed *inside* the container, which are guaranteed to be compatible with Alpine Linux.

### 3. Server Hosting
Vite's default is `localhost`, which is unreachable from outside a container. We updated `vite.config.ts` to use `host: true` (which maps to `0.0.0.0`), allowing the port to be exposed to your Mac.

### 4. Polling for HMR
We enabled `usePolling: true` in the Vite config. Docker volume mounting sometimes misses file-system events on certain OS configurations (like some versions of macOS/Windows); polling ensures Hot Module Replacement always works reliably.

---

## Production Port Best Practices

In a real production environment, you should follow these rules:

1. **Standard Ports (80/443)**: Web applications should be accessible via port `80` (HTTP) or `443` (HTTPS). Users shouldn't have to type `:5173` or `:8080` in their browser.
2. **Internal vs External Ports**: 
   - **Internal**: Inside the container, Nginx usually runs on port `80`.
   - **External**: On your server, you map port `80` to that container.
3. **Reverse Proxy**: Use a reverse proxy (like Nginx, Traefik, or Caddy) on the host machine to handle SSL/TLS and route traffic to your containers.
4. **Environment Separation**: Do not use the same host port for dev and prod simultaneously. This is why we now use `5173` for dev and `8080` for prod.

---

## Summary of Ports (Updated)
- **Development**: Host `5173` -> Container `5173`
- **Production**: Host `8080` -> Container `80`
