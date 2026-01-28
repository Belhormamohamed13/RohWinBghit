const { z } = require("zod");

const createBooking = z.object({
  body: z.object({
    tripId: z.string().min(1),
    seatCount: z.number().int().min(1).max(8),
    passengerMessage: z.string().max(500).optional()
  })
});

const bookingIdParams = z.object({
  params: z.object({
    id: z.string().min(1)
  })
});

const bookingSchemas = { createBooking, bookingIdParams };

module.exports = { bookingSchemas };

