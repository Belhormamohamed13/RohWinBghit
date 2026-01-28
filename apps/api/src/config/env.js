const { z } = require("zod");

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),

  MONGODB_URI: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL_SECONDS: z.coerce.number().int().min(60).max(86400).default(900),
  JWT_REFRESH_TTL_DAYS: z.coerce.number().int().min(1).max(365).default(30),

  COOKIE_DOMAIN: z.string().min(1).default("localhost"),
  COOKIE_SECURE: z
    .string()
    .transform((v) => v === "true")
    .default("false"),

  CORS_ORIGIN: z.string().min(1),

  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  EMAIL_FROM: z.string().min(1),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),

  SMS_PROVIDER: z.enum(["mock"]).default("mock"),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const env = parsed.data;

module.exports = { env };

