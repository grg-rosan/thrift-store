FROM node:22-bookworm
WORKDIR /app

# Install deps first for layer caching
COPY package*.json ./
COPY prisma ./prisma
RUN npm install

COPY . .

# Entry script handles: wait-for-db -> migration check -> start
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN apt-get update && apt-get install -y dos2unix && \
    dos2unix /app/docker-entrypoint.sh && \
    chmod +x /app/docker-entrypoint.sh

EXPOSE 4000

HEALTHCHECK --interval=10s --timeout=5s --retries=5 --start-period=15s \
  CMD curl -f http://localhost:4000/health || exit 1

ENTRYPOINT ["/app/docker-entrypoint.sh"]