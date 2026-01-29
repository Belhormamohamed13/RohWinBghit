const express = require("express");

const { validate } = require("../middlewares/validate");
const { requireAuth } = require("../middlewares/requireAuth");
const { bookingController } = require("../controllers/booking.controller");
const { bookingSchemas } = require("../validations/booking.validation");

const bookingsRouter = express.Router();

bookingsRouter.use(requireAuth);

bookingsRouter.post("/", validate(bookingSchemas.createBooking), bookingController.create);
bookingsRouter.get("/me", bookingController.listMine);
bookingsRouter.get("/trip/:tripId", bookingController.listForTrip);
bookingsRouter.patch("/:id/accept", bookingController.accept);
bookingsRouter.patch("/:id/reject", bookingController.reject);
bookingsRouter.patch("/:id/cancel", bookingController.cancel);

module.exports = { bookingsRouter };

