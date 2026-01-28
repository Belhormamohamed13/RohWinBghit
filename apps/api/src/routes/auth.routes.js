const express = require("express");

const { validate } = require("../middlewares/validate");
const { authController } = require("../controllers/auth.controller");
const { authSchemas } = require("../validations/auth.validation");

const authRouter = express.Router();

authRouter.post("/register", validate(authSchemas.register), authController.register);
authRouter.post("/login", validate(authSchemas.login), authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);

module.exports = { authRouter };

