const createError = require("http-errors");

const { Message } = require("../models/message.model");
const { Trip } = require("../models/trip.model");
const { Booking } = require("../models/booking.model");
const { emitDomainEvent } = require("../realtime/socketBus");

const messageService = {
  async sendMessage(input, senderId) {
    let trip = null;
    if (input.tripId) {
      trip = await Trip.findById(input.tripId);
      if (!trip) throw createError(404, "Trip not found");
    }

    let booking = null;
    if (input.bookingId) {
      booking = await Booking.findById(input.bookingId);
      if (!booking) throw createError(404, "Booking not found");
    }

    const message = await Message.create({
      sender: senderId,
      receiver: input.receiverId,
      trip: trip ? trip._id : undefined,
      booking: booking ? booking._id : undefined,
      content: input.content
    });

    emitDomainEvent("message.created", {
      messageId: String(message._id),
      senderId: String(senderId),
      receiverId: String(input.receiverId),
      tripId: trip ? String(trip._id) : undefined
    });

    return message;
  },

  async getMessagesByTrip(tripId, userId) {
    const trip = await Trip.findById(tripId);
    if (!trip) throw createError(404, "Trip not found");

    const messages = await Message.find({ trip: tripId })
      .sort({ createdAt: 1 })
      .lean();

    // Caller must ensure user is allowed (driver or passenger in a booking)
    return messages;
  }
};

module.exports = { messageService };

