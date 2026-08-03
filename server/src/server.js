import http from 'http';
import { WebSocketServer } from 'ws';

import app from './app.js';
import { prisma } from './lib/prisma.js';
import { initChatSocket } from './sockets/chat.socket.js';

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

// WebSocket layer for real-time chat, attached to the same HTTP server
const wss = new WebSocketServer({ server, path: '/ws/chat' });
initChatSocket(wss);

async function start() {
  try {
    // Sanity-check the DB connection before accepting traffic.
    // The entrypoint script already gates on pg_isready + migrations,
    // but this is the app-level check that Prisma's client itself
    // can talk to the DB post-migration.
    await prisma.$connect();
    console.log('Database connection established.');

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Graceful shutdown — required so `docker stop` / SIGTERM
// doesn't kill in-flight requests or leave the DB pool dangling.
async function shutdown(signal) {
  console.log(`${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start();