const { Server } = require("socket.io");

const { env } = require("../config/env");
const { logger } = require("../utils/logger");
const { registerIo } = require("../realtime/socketBus");

function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    logger.info(`socket connected: ${socket.id}`);

    socket.on("disconnect", () => {
      logger.info(`socket disconnected: ${socket.id}`);
    });
  });

  registerIo(io);
  return io;
}

module.exports = { createSocketServer };

