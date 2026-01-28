const { messageService } = require("../services/message.service");
const { Booking } = require("../models/booking.model");
const { Trip } = require("../models/trip.model");

const messageController = {
  async send(req, res, next) {
    try {
      const { body } = req.validated;
      const message = await messageService.sendMessage(body, req.auth.user._id);
      return res.status(201).json({ success: true, data: message });
    } catch (err) {
      return next(err);
    }
  },

  async byTrip(req, res, next) {
    try {
      const { tripId } = req.validated.params;
      const trip = await Trip.findById(tripId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          error: { code: "NOT_FOUND", message: "Trip not found" }
        });
      }

      const isDriver = String(trip.driver) === String(req.auth.user._id);
      let isPassenger = false;
      if (!isDriver) {
        const booking = await Booking.findOne({
          trip: trip._id,
          passenger: req.auth.user._id
        }).lean();
        isPassenger = !!booking;
      }
      if (!isDriver && !isPassenger) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "You are not part of this trip" }
        });
      }

      const messages = await messageService.getMessagesByTrip(tripId, req.auth.user._id);
      return res.json({ success: true, data: messages });
    } catch (err) {
      return next(err);
    }
  }
};

module.exports = { messageController };

