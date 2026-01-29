const createError = require("http-errors");
const dayjs = require("dayjs");

const { Trip } = require("../models/trip.model");

const tripService = {
  async createTrip(input, driverId) {
    const departureAt = new Date(input.departureAt);
    if (Number.isNaN(departureAt.getTime()) || dayjs(departureAt).isBefore(dayjs())) {
      throw createError(400, "Departure date must be in the future");
    }

    const arrivalEstimateAt = input.arrivalEstimateAt
      ? new Date(input.arrivalEstimateAt)
      : undefined;

    const trip = await Trip.create({
      driver: driverId,
      departureCity: input.departureCity,
      departureWilayaCode: input.departureWilayaCode,
      arrivalCity: input.arrivalCity,
      arrivalWilayaCode: input.arrivalWilayaCode,
      departureAt,
      arrivalEstimateAt,
      seatsTotal: input.seatsTotal,
      seatsAvailable: input.seatsTotal,
      pricePerSeat: input.pricePerSeat,
      description: input.description ?? "",
      vehicle: input.vehicle,
      status: "published"
    });

    return trip;
  },

  async searchTrips(filters) {
    const minSeats = filters.seats ?? 1;
    const query = {
      departureCity: new RegExp(`^${filters.from}$`, "i"),
      arrivalCity: new RegExp(`^${filters.to}$`, "i"),
      status: "published",
      seatsAvailable: { $gte: minSeats }
    };

    if (filters.date) {
      const day = dayjs(filters.date);
      if (day.isValid()) {
        query.departureAt = {
          $gte: day.startOf("day").toDate(),
          $lte: day.endOf("day").toDate()
        };
      }
    } else {
      query.departureAt = { $gte: dayjs().toDate() };
    }

    const trips = await Trip.find(query).sort({ departureAt: 1 }).limit(50).lean();
    return trips;
  },

  async getTripById(tripId) {
    const trip = await Trip.findById(tripId).lean();
    if (!trip) throw createError(404, "Trip not found");
    return trip;
  },

  async listMyTrips(driverId) {
    const trips = await Trip.find({ driver: driverId })
      .sort({ departureAt: 1 })
      .lean();
    return trips;
  },

  async cancelTrip(tripId, driverId) {
    const trip = await Trip.findById(tripId);
    if (!trip) throw createError(404, "Trip not found");
    if (String(trip.driver) !== String(driverId)) {
      throw createError(403, "You are not the driver of this trip");
    }
    if (trip.status !== "published") {
      throw createError(400, "Only published trips can be cancelled");
    }
    trip.status = "cancelled";
    await trip.save();
    return trip;
  }
};

module.exports = { tripService };

