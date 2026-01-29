const { bookingService } = require("../services/booking.service");
const { Booking } = require("../models/booking.model");
const { Trip } = require("../models/trip.model");

const bookingController = {
  async create(req, res, next) {
    try {
      const { body } = req.validated;
      const booking = await bookingService.createBooking(body, req.auth.user._id);
      return res.status(201).json({ success: true, data: booking });
    } catch (err) {
      return next(err);
    }
  },

  async accept(req, res, next) {
    try {
      const booking = await bookingService.acceptBooking(req.params.id, req.auth.user._id);
      return res.json({
        success: true,
        data: {
          id: String(booking._id),
          status: booking.status,
          seatCount: booking.seatCount,
          tripId: String(booking.trip),
          passengerId: String(booking.passenger)
        }
      });
    } catch (err) {
      return next(err);
    }
  },

  async reject(req, res, next) {
    try {
      const booking = await bookingService.rejectBooking(req.params.id, req.auth.user._id);
      return res.json({
        success: true,
        data: {
          id: String(booking._id),
          status: booking.status,
          seatCount: booking.seatCount,
          tripId: String(booking.trip),
          passengerId: String(booking.passenger)
        }
      });
    } catch (err) {
      return next(err);
    }
  },

  async cancel(req, res, next) {
    try {
      const booking = await bookingService.cancelBooking(req.params.id, req.auth.user._id);
      return res.json({
        success: true,
        data: {
          id: String(booking._id),
          status: booking.status,
          seatCount: booking.seatCount,
          tripId: String(booking.trip),
          passengerId: String(booking.passenger)
        }
      });
    } catch (err) {
      return next(err);
    }
  },

  async listMine(req, res, next) {
    try {
      const bookings = await bookingService.listMyBookings(req.auth.user._id);
      return res.json({ success: true, data: bookings });
    } catch (err) {
      return next(err);
    }
  },

  async listForTrip(req, res, next) {
    try {
      const trip = await Trip.findById(req.params.tripId);
      if (!trip) {
        return res.status(404).json({
          success: false,
          error: { code: "NOT_FOUND", message: "Trip not found" }
        });
      }
      if (String(trip.driver) !== String(req.auth.user._id)) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Only driver can see bookings for this trip" }
        });
      }
      const bookings = await Booking.find({ trip: trip._id }).sort({ createdAt: -1 }).lean();
      return res.json({ success: true, data: bookings });
    } catch (err) {
      return next(err);
    }
  }
};

module.exports = { bookingController };

