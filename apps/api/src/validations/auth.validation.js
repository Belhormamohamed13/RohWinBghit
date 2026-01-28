const { z } = require("zod");

const phoneRegex = /^(?:\+213|0)[567]\d{8}$/;

const register = z.object({
  body: z
    .object({
      firstName: z.string().min(2),
      lastName: z.string().min(2),
      email: z.string().email(),
      phone: z.string().regex(phoneRegex),
      password: z.string().min(8),
      wilayaCode: z.string().min(2),
      isDriver: z.boolean().default(false),
      isPassenger: z.boolean().default(true)
    })
    .refine((v) => v.isDriver || v.isPassenger, {
      message: "At least one role required (driver/passenger)"
    })
});

const login = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(1)
  })
});

const authSchemas = { register, login };

module.exports = { authSchemas };

