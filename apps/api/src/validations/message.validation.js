const { z } = require("zod");

const sendMessage = z.object({
  body: z.object({
    receiverId: z.string().min(1),
    tripId: z.string().min(1).optional(),
    bookingId: z.string().min(1).optional(),
    content: z.string().min(1).max(2000)
  })
});

const messagesByTrip = z.object({
  params: z.object({
    tripId: z.string().min(1)
  })
});

const messageSchemas = { sendMessage, messagesByTrip };

module.exports = { messageSchemas };

