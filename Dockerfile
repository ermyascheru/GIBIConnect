# Multi-stage Production Dockerfile for GIBIConnect
# Stage 1: Build & Dependency Assembly
FROM node:20-alpine AS base
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl python3 make g++

# Copy package manifests
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --only=production

# Stage 2: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy node modules and backend source
COPY --from=base /app/backend/node_modules ./backend/node_modules
COPY backend ./backend
COPY database ./database
COPY frontend ./frontend

# Create local storage directory
RUN mkdir -p /app/backend/storage/uploads

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

WORKDIR /app/backend
CMD ["node", "src/server.js"]
