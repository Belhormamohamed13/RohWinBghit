const express = require("express");

const { requireAuth } = require("../middlewares/requireAuth");
const { usersController } = require("../controllers/users.controller");

const usersRouter = express.Router();

usersRouter.get("/me", requireAuth, usersController.me);
usersRouter.get("/:id", usersController.publicProfile);

module.exports = { usersRouter };

