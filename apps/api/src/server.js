const http = require("http");

const { createApp } = require("./app");
const { connectToMongo } = require("./start/connectToMongo");
const { createSocketServer } = require("./start/createSocketServer");
const { env } = require("./config/env");
const { logger } = require("./utils/logger");

async function main() {
  await connectToMongo();

  const app = createApp();
  const server = http.createServer(app);
  createSocketServer(server);

  server.listen(env.PORT, () => {
    logger.info(`API listening on :${env.PORT} (${env.NODE_ENV})`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

