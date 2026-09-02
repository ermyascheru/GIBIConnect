FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p /app/storage/uploads \
    && chown -R node:node /app/storage

USER node

EXPOSE 5000

CMD ["node", "src/server.js"]
