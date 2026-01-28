const express = require("express");

const { authRouter } = require("./auth.routes");
const { usersRouter } = require("./users.routes");
const { tripsRouter } = require("./trips.routes");
const { bookingsRouter } = require("./bookings.routes");
const { messagesRouter } = require("./messages.routes");

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/trips", tripsRouter);
apiRouter.use("/bookings", bookingsRouter);
apiRouter.use("/messages", messagesRouter);

module.exports = { apiRouter };

