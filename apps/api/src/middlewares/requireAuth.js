const createError = require("http-errors");

const { verifyAccessToken } = require("../utils/tokens");
const { User } = require("../models/user.model");

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
    if (!token) throw createError(401, "Missing access token");

    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).lean();
    if (!user) throw createError(401, "Invalid token");
    if (user.accountStatus !== "active") throw createError(403, "Account not active");

    req.auth = { user };
    return next();
  } catch (err) {
    return next(err);
  }
}

module.exports = { requireAuth };

