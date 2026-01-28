const createError = require("http-errors");

const { Booking } = require("../models/booking.model");
const { Trip } = require("../models/trip.model");
const { emitDomainEvent } = require("../realtime/socketBus");

const bookingService = {
  async createBooking(input, passengerId) {
    const trip = await Trip.findById(input.tripId);
    if (!trip) throw createError(404, "Trip not found");
    if (trip.status !== "published") {
      throw createError(400, "Trip is not available for booking");
    }
    if (String(trip.driver) === String(passengerId)) {
      throw createError(400, "Driver cannot book own trip");
    }
    if (trip.seatsAvailable < input.seatCount) {
      throw createError(400, "Not enough seats available");
    }

    const existing = await Booking.findOne({
      trip: trip._id,
      passenger: passengerId
    }).lean();
    if (existing) throw createError(400, "You already have a booking for this trip");

    const totalAmount = trip.pricePerSeat * input.seatCount;

    const booking = await Booking.create({
      trip: trip._id,
      passenger: passengerId,
      seatCount: input.seatCount,
      totalAmount,
      passengerMessage: input.passengerMessage ?? "",
      status: "pending",
      payment: { status: "not_required", method: "cash" }
    });

    emitDomainEvent("booking.created", {
      bookingId: String(booking._id),
      tripId: String(trip._id),
      passengerId: String(passengerId)
    });

    return booking;
  },

  async acceptBooking(bookingId, driverId) {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw createError(404, "Booking not found");
    if (booking.status !== "pending") {
      throw createError(400, "Only pending bookings can be accepted");
    }

    const trip = await Trip.findById(booking.trip);
    if (!trip) throw createError(404, "Trip not found");
    if (String(trip.driver) !== String(driverId)) {
      throw createError(403, "You are not the driver of this trip");
    }
    if (trip.seatsAvailable < booking.seatCount) {
      throw createError(400, "Not enough seats available");
    }

    booking.status = "accepted";
    booking.payment.status = "pending";
    await booking.save();

    trip.seatsAvailable -= booking.seatCount;
    await trip.save();

    emitDomainEvent("booking.statusChanged", {
      bookingId: String(booking._id),
      tripId: String(trip._id),
      status: booking.status
    });

    return booking;
  },

  async rejectBooking(bookingId, driverId) {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw createError(404, "Booking not found");
    if (booking.status !== "pending") {
      throw createError(400, "Only pending bookings can be rejected");
    }
    const trip = await Trip.findById(booking.trip);
    if (!trip) throw createError(404, "Trip not found");
    if (String(trip.driver) !== String(driverId)) {
      throw createError(403, "You are not the driver of this trip");
    }

    booking.status = "rejected";
    await booking.save();

    emitDomainEvent("booking.statusChanged", {
      bookingId: String(booking._id),
      tripId: String(trip._id),
      status: booking.status
    });

    return booking;
  },

  async cancelBooking(bookingId, userId) {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw createError(404, "Booking not found");

    const trip = await Trip.findById(booking.trip);
    if (!trip) throw createError(404, "Trip not found");

    const isPassenger = String(booking.passenger) === String(userId);
    const isDriver = String(trip.driver) === String(userId);
    if (!isPassenger && !isDriver) {
      throw createError(403, "You are not part of this booking");
    }

    if (booking.status === "accepted") {
      trip.seatsAvailable += booking.seatCount;
      await trip.save();
    }

    booking.status = "cancelled";
    await booking.save();

    emitDomainEvent("booking.statusChanged", {
      bookingId: String(booking._id),
      tripId: String(trip._id),
      status: booking.status
    });

    return booking;
  },

  async listMyBookings(passengerId) {
    const bookings = await Booking.find({ passenger: passengerId })
      .populate("trip")
      .sort({ createdAt: -1 })
      .lean();
    return bookings;
  }
};

module.exports = { bookingService };

