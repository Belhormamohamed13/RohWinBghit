const express = require("express");

const { validate } = require("../middlewares/validate");
const { requireAuth } = require("../middlewares/requireAuth");
const { messageController } = require("../controllers/message.controller");
const { messageSchemas } = require("../validations/message.validation");

const messagesRouter = express.Router();

messagesRouter.use(requireAuth);

messagesRouter.post("/", validate(messageSchemas.sendMessage), messageController.send);
messagesRouter.get(
  "/by-trip/:tripId",
  validate(messageSchemas.messagesByTrip),
  messageController.byTrip
);

module.exports = { messagesRouter };

