# Deployment Guide

## Environment Variables
Ensure these variables are set in your production environment or `.env` file:

- `REDIS_HOST`: Hostname of the Redis server.
- `REDIS_PORT`: Port of the Redis server (default 6379).
- `PORT`: API port (default 3000).

## Docker Deployment
1. Build the images:
   ```bash
   docker compose build
   ```
2. Run in background:
   ```bash
   docker compose up -d
   ```

## Security Notes
- **Sandboxing**: The Worker runs Puppeteer with `--no-sandbox`. In a high-security environment, consider using a seccomp profile or running in a VM that specifically handles untrusted rendering.
- **Network**: Ensure the worker container cannot access internal metadata services (e.g., AWS Instance Metadata Service) by using network policies.

## Scaling
- **Workers**: You can run multiple worker containers to process the queue faster.
  ```bash
  docker compose up -d --scale worker=3
  ```
- **API**: The API is stateless and can be horizontally scaled behind a load balancer.

## Health Checks
- API exposes `GET /health` for readiness/liveness probes.
