const express = require("express");

const { validate } = require("../middlewares/validate");
const { requireAuth } = require("../middlewares/requireAuth");
const { tripController } = require("../controllers/trip.controller");
const { tripSchemas } = require("../validations/trip.validation");

const tripsRouter = express.Router();

tripsRouter.get("/", validate(tripSchemas.searchTrips), tripController.search);
tripsRouter.get("/:id", tripController.detail);
tripsRouter.post("/", requireAuth, validate(tripSchemas.createTrip), tripController.create);
tripsRouter.post("/:id/cancel", requireAuth, tripController.cancel);
tripsRouter.get("/me/mine", requireAuth, tripController.myTrips);

module.exports = { tripsRouter };

