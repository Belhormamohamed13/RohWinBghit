const mongoose = require("mongoose");

const { env } = require("../config/env");
const { logger } = require("../utils/logger");

async function connectToMongo() {
  mongoose.set("strictQuery", true);

  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== "production",
  });

  logger.info("Connected to MongoDB");
}

module.exports = { connectToMongo };

