# Docker Setup for QR Contact

## Prerequisites

1. **Install Docker Desktop** (if not already installed):
   - Download from: https://www.docker.com/products/docker-desktop/
   - Start Docker Desktop application

2. **Verify Docker is running**:
   ```bash
   docker --version
   docker-compose --version
   ```

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start the application
npm run docker:up

# View logs
npm run docker:logs

# Stop the application
npm run docker:down
```

### Option 2: Manual Docker Commands

```bash
# Build the Docker image
npm run docker:build

# Run the container
npm run docker:run
```

### Option 3: Production with Nginx

```bash
# Start with nginx reverse proxy
docker-compose --profile production up -d

# Access the application
open http://localhost
```

## Available Commands

- `npm run docker:build` - Build Docker image
- `npm run docker:run` - Run container directly
- `npm run docker:up` - Start with docker-compose
- `npm run docker:down` - Stop docker-compose services
- `npm run docker:logs` - View container logs

## Application URLs

- **Development**: http://localhost:5174
- **Docker**: http://localhost:3000
- **Production (with nginx)**: http://localhost

## Docker Configuration

### Multi-stage Build
- **deps**: Install production dependencies
- **builder**: Build the SvelteKit application
- **runner**: Final production image with minimal footprint

### Security Features
- Non-root user (sveltekit:nodejs)
- Minimal Alpine Linux base
- Health checks included
- Security headers via nginx

### Performance Optimizations
- Multi-stage build for smaller images
- Gzip compression
- Static file caching
- Rate limiting

## Troubleshooting

### Docker daemon not running
```bash
# Start Docker Desktop application manually
open -a "Docker Desktop"

# Or start via command line (requires sudo)
sudo launchctl start com.docker.docker
```

### Port conflicts
```bash
# Check what's using port 3000
lsof -i :3000

# Use different port
docker run -p 3001:3000 qrcontact
```

### Build failures
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache -t qrcontact .
```

## Production Deployment

For production deployment, consider:

1. **Environment variables**:
   ```bash
   docker run -e NODE_ENV=production -e PORT=3000 qrcontact
   ```

2. **Volume mounts** for logs:
   ```bash
   docker run -v /host/logs:/app/logs qrcontact
   ```

3. **Health checks**:
   ```bash
   docker run --health-cmd="curl -f http://localhost:3000/health" qrcontact
   ```

4. **Resource limits**:
   ```bash
   docker run --memory=512m --cpus=1 qrcontact
   ```

## Docker Image Details

- **Base**: Node.js 20 Alpine Linux
- **Size**: ~150MB (optimized)
- **User**: sveltekit (non-root)
- **Port**: 3000
- **Health check**: HTTP endpoint
