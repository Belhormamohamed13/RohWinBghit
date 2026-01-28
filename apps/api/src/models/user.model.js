const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    passwordHash: { type: String, required: true },
    profilePhotoUrl: { type: String, default: "" },
    wilayaCode: { type: String, required: true },

    isDriver: { type: Boolean, default: false },
    isPassenger: { type: Boolean, default: true },

    roles: {
      type: [String],
      default: ["user"],
      index: true
    },

    accountStatus: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
      index: true
    },

    verification: {
      emailVerified: { type: Boolean, default: false },
      phoneVerified: { type: Boolean, default: false }
    },

    stats: {
      ratingAvg: { type: Number, default: 0 },
      ratingCount: { type: Number, default: 0 }
    },

    preferences: {
      language: { type: String, enum: ["fr", "ar"], default: "fr" }
    },

    lastLoginAt: { type: Date }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = { User };
