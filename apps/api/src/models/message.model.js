const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: false
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: false
    },
    content: { type: String, required: true },
    readAt: { type: Date, required: false }
  },
  { timestamps: true }
);

messageSchema.index({ trip: 1, createdAt: 1 });
messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

const Message = mongoose.model("Message", messageSchema);

module.exports = { Message };

