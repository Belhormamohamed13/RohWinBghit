const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const createError = require("http-errors");
const morgan = require("morgan");

const { env } = require("./config/env");
const { errorHandler } = require("./middlewares/errorHandler");
const { apiRouter } = require("./routes");

function createApp() {
  const app = express();

  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(compression());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 200,
      standardHeaders: true,
      legacyHeaders: false,
    })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    morgan("tiny", {
      skip: () => env.NODE_ENV === "test",
    })
  );

  app.get("/api/health", (req, res) => {
    res.json({ ok: true, name: "rohwinbghit-api", env: env.NODE_ENV });
  });

  app.use("/api", apiRouter);

  app.use((req, res, next) => {
    next(createError(404, "Not found"));
  });

  app.use(errorHandler);

  return app;
}

module.exports = { createApp };

