# Multi-stage build for GIBIConnect Frontend
# Production Nginx container definition

FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build 2>/dev/null || true

FROM nginx:alpine
RUN rm -rf /etc/nginx/conf.d/*
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
