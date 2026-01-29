const createError = require("http-errors");

const { Trip } = require("../models/trip.model");
const { emitDomainEvent } = require("../realtime/socketBus");

const tripLifecycleService = {
  async publishTrip(tripId, driverId) {
    const trip = await Trip.findById(tripId);
    if (!trip) throw createError(404, "Trip not found");
    if (String(trip.driver) !== String(driverId)) throw createError(403, "Forbidden");

    const previousStatus = trip.status;
    if (previousStatus !== "draft") {
      throw createError(400, "Only draft trips can be published");
    }

    trip.status = "published";
    await trip.save();

    emitDomainEvent("trip.statusChanged", {
      tripId: String(trip._id),
      previousStatus,
      newStatus: "published"
    });

    return trip;
  },

  async closeTrip(tripId, driverId) {
    const trip = await Trip.findById(tripId);
    if (!trip) throw createError(404, "Trip not found");
    if (String(trip.driver) !== String(driverId)) throw createError(403, "Forbidden");

    const previousStatus = trip.status;
    if (previousStatus !== "published") {
      throw createError(400, "Only published trips can be closed");
    }

    trip.status = "closed";
    await trip.save();

    emitDomainEvent("trip.statusChanged", {
      tripId: String(trip._id),
      previousStatus,
      newStatus: "closed"
    });

    return trip;
  }
};

module.exports = { tripLifecycleService };

