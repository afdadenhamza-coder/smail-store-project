# 10 — Deployment (Docker + Easypanel)

## Overview

Two Docker containers: `frontend` (Next.js) + `backend` (FastAPI). PostgreSQL runs as a separate Easypanel service or existing installation.

## docker-compose.yml

```yaml
version: "3.8"

services:
  backend:
    build: ./backend
    container_name: smailstore-backend
    restart: unless-stopped
    ports:
      - "8000:8000"
    env_file:
      - .env
    depends_on:
      db:
        condition: service_healthy
    networks:
      - smailstore-network

  frontend:
    build: ./frontend
    container_name: smailstore-frontend
    restart: unless-stopped
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - backend
    networks:
      - smailstore-network

  db:
    image: postgres:15-alpine
    container_name: smailstore-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: smailstore
      POSTGRES_USER: smailstore_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U smailstore_user -d smailstore"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - smailstore-network

volumes:
  postgres_data:

networks:
  smailstore-network:
    driver: bridge
```

## Frontend Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
```

## Backend Dockerfile

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Easypanel Steps

1. Create a new service in Easypanel
2. Select "Docker Compose"
3. Paste the docker-compose.yml content
4. Set environment variables
5. Deploy

## Domain Configuration

- Domain `smailstore.shop` → points to server IP
- Frontend served on `https://smailstore.shop:3000` (or reverse-proxy to port 3000)
- Backend on `https://api.smailstore.shop:8000` (or reverse-proxy to port 8000)
- Easypanel handles SSL via Traefik/Caddy

### nginx/traefik reverse proxy (if needed)

```
smailstore.shop  →  proxy_pass http://localhost:3000
api.smailstore.shop  →  proxy_pass http://localhost:8000
```

## Running Migrations

```bash
docker exec smailstore-backend alembic upgrade head
```
