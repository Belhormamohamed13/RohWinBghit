const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Locations
    departureCity: { type: String, required: true, trim: true },
    departureWilayaCode: { type: String, required: true },
    departureCoords: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false }
    },

    arrivalCity: { type: String, required: true, trim: true },
    arrivalWilayaCode: { type: String, required: true },
    arrivalCoords: {
      lat: { type: Number, required: false },
      lng: { type: Number, required: false }
    },

    departureAt: { type: Date, required: true },
    arrivalEstimateAt: { type: Date, required: false },

    // Seats & pricing
    seatsTotal: { type: Number, required: true, min: 1, max: 8 },
    seatsAvailable: { type: Number, required: true, min: 0, max: 8 },
    pricePerSeat: { type: Number, required: true, min: 0 },

    // Vehicle & comfort
    vehicle: {
      make: { type: String, required: false, trim: true },
      model: { type: String, required: false, trim: true },
      color: { type: String, required: false, trim: true },
      year: { type: Number, required: false },
      comfort: {
        ac: { type: Boolean, default: false },
        petsAllowed: { type: Boolean, default: false },
        music: { type: Boolean, default: true },
        smokingAllowed: { type: Boolean, default: false },
        talkative: { type: Boolean, default: true }
      }
    },

    description: { type: String, default: "" },

    status: {
      type: String,
      enum: ["draft", "published", "in_progress", "completed", "cancelled"],
      default: "published"
    }
  },
  { timestamps: true }
);

tripSchema.index(
  { departureCity: 1, arrivalCity: 1, departureAt: 1, status: 1 },
  { name: "trip_search_index" }
);
tripSchema.index({ driver: 1, departureAt: -1 });
tripSchema.index({ status: 1, departureAt: 1 });

const Trip = mongoose.model("Trip", tripSchema);

module.exports = { Trip };

