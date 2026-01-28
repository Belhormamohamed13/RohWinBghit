const bcrypt = require("bcryptjs");
const createError = require("http-errors");
const { nanoid } = require("nanoid");

const { User } = require("../models/user.model");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../utils/tokens");

function publicUser(userDoc) {
  return {
    id: String(userDoc._id),
    firstName: userDoc.firstName,
    lastName: userDoc.lastName,
    email: userDoc.email,
    phone: userDoc.phone,
    wilayaCode: userDoc.wilayaCode,
    roles: userDoc.roles,
    isDriver: userDoc.isDriver,
    isPassenger: userDoc.isPassenger,
    verification: userDoc.verification,
    stats: userDoc.stats,
    profilePhotoUrl: userDoc.profilePhotoUrl
  };
}

const authService = {
  async register(input) {
    const existing = await User.findOne({
      $or: [{ email: input.email.toLowerCase() }, { phone: input.phone }]
    }).lean();
    if (existing) throw createError(409, "Email or phone already in use");

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await User.create({
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email.toLowerCase(),
      phone: input.phone,
      passwordHash,
      wilayaCode: input.wilayaCode,
      isDriver: !!input.isDriver,
      isPassenger: !!input.isPassenger,
      roles: ["user"]
    });

    const tokenId = nanoid();
    const accessToken = signAccessToken(String(user._id));
    const refreshToken = signRefreshToken(String(user._id), tokenId);

    return { user: publicUser(user), accessToken, refreshToken };
  },

  async login(input) {
    const user = await User.findOne({ email: input.email.toLowerCase() });
    if (!user) throw createError(401, "Invalid credentials");
    if (user.accountStatus !== "active") throw createError(403, "Account not active");

    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) throw createError(401, "Invalid credentials");

    user.lastLoginAt = new Date();
    await user.save();

    const tokenId = nanoid();
    const accessToken = signAccessToken(String(user._id));
    const refreshToken = signRefreshToken(String(user._id), tokenId);

    return { user: publicUser(user), accessToken, refreshToken };
  },

  async refresh(refreshToken) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw createError(401, "Invalid refresh token");
    }

    const user = await User.findById(payload.sub);
    if (!user) throw createError(401, "Invalid refresh token");
    if (user.accountStatus !== "active") throw createError(403, "Account not active");

    const tokenId = nanoid();
    const accessToken = signAccessToken(String(user._id));
    const rotatedRefreshToken = signRefreshToken(String(user._id), tokenId);

    return { accessToken, refreshToken: rotatedRefreshToken };
  }
};

module.exports = { authService };

