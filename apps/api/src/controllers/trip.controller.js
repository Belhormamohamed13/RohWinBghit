const { tripService } = require("../services/trip.service");
const { tripLifecycleService } = require("../services/tripLifecycle.service");

const tripController = {
  async create(req, res, next) {
    try {
      const user = req.auth.user;
      if (!user.isDriver) {
        return res.status(403).json({
          success: false,
          error: { code: "FORBIDDEN", message: "Only drivers can publish trips" }
        });
      }

      const { body } = req.validated;
      const trip = await tripService.createTrip(body, user._id);

      return res.status(201).json({ success: true, data: trip });
    } catch (err) {
      return next(err);
    }
  },

  async search(req, res, next) {
    try {
      const { query } = req.validated;
      const trips = await tripService.searchTrips({
        from: query.from,
        to: query.to,
        date: query.date,
        seats: query.seats
      });
      return res.json({ success: true, data: trips });
    } catch (err) {
      return next(err);
    }
  },

  async detail(req, res, next) {
    try {
      const trip = await tripService.getTripById(req.params.id);
      return res.json({ success: true, data: trip });
    } catch (err) {
      return next(err);
    }
  },

  async cancel(req, res, next) {
    try {
      const trip = await tripService.cancelTrip(req.params.id, req.auth.user._id);
      return res.json({ success: true, data: trip });
    } catch (err) {
      return next(err);
    }
  },

  async myTrips(req, res, next) {
    try {
      const trips = await tripService.listMyTrips(req.auth.user._id);
      return res.json({ success: true, data: trips });
    } catch (err) {
      return next(err);
    }
  },

  async publish(req, res, next) {
    try {
      const trip = await tripLifecycleService.publishTrip(req.params.id, req.auth.user._id);
      return res.json({
        success: true,
        data: {
          id: String(trip._id),
          status: trip.status
        }
      });
    } catch (err) {
      return next(err);
    }
  },

  async close(req, res, next) {
    try {
      const trip = await tripLifecycleService.closeTrip(req.params.id, req.auth.user._id);
      return res.json({
        success: true,
        data: {
          id: String(trip._id),
          status: trip.status
        }
      });
    } catch (err) {
      return next(err);
    }
  }
};

module.exports = { tripController };

