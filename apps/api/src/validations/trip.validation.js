const { z } = require("zod");

const createTrip = z.object({
  body: z.object({
    departureCity: z.string().min(2),
    departureWilayaCode: z.string().min(2),
    arrivalCity: z.string().min(2),
    arrivalWilayaCode: z.string().min(2),
    departureAt: z.string().datetime(),
    arrivalEstimateAt: z.string().datetime().optional(),
    seatsTotal: z.number().int().min(1).max(8),
    pricePerSeat: z.number().min(0),
    description: z.string().max(500).optional(),
    vehicle: z
      .object({
        make: z.string().optional(),
        model: z.string().optional(),
        color: z.string().optional(),
        year: z.number().int().optional()
      })
      .optional()
  })
});

const searchTrips = z.object({
  query: z.object({
    from: z.string().min(2),
    to: z.string().min(2),
    date: z.string().optional(),
    seats: z
      .string()
      .optional()
      .transform((v) => (v ? Number(v) : undefined))
  })
});

const tripSchemas = { createTrip, searchTrips };

module.exports = { tripSchemas };

