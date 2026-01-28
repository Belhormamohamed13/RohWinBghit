const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true
    },
    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    seatCount: { type: Number, required: true, min: 1, max: 8 },
    totalAmount: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled", "completed"],
      default: "pending"
    },

    payment: {
      status: {
        type: String,
        enum: ["not_required", "pending", "paid", "failed", "refunded"],
        default: "not_required"
      },
      method: {
        type: String,
        enum: ["cash", "cib_sim", "baridimob_sim", null],
        default: "cash"
      },
      providerRef: { type: String, default: "" }
    },

    passengerMessage: { type: String, default: "" }
  },
  { timestamps: true }
);

bookingSchema.index({ trip: 1, passenger: 1 }, { unique: true });
bookingSchema.index({ passenger: 1, createdAt: -1 });
bookingSchema.index({ trip: 1, status: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = { Booking };

