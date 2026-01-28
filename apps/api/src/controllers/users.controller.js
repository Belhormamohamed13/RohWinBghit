const createError = require("http-errors");

const { User } = require("../models/user.model");

const usersController = {
  async me(req, res, next) {
    try {
      const user = req.auth.user;
      return res.json({
        success: true,
        data: {
          id: String(user._id),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          wilayaCode: user.wilayaCode,
          roles: user.roles,
          isDriver: user.isDriver,
          isPassenger: user.isPassenger,
          verification: user.verification,
          stats: user.stats,
          preferences: user.preferences
        }
      });
    } catch (err) {
      return next(err);
    }
  },

  async publicProfile(req, res, next) {
    try {
      const user = await User.findById(req.params.id).lean();
      if (!user) throw createError(404, "User not found");
      if (user.accountStatus !== "active") throw createError(404, "User not found");

      return res.json({
        success: true,
        data: {
          id: String(user._id),
          firstName: user.firstName,
          lastName: user.lastName,
          profilePhotoUrl: user.profilePhotoUrl,
          wilayaCode: user.wilayaCode,
          verification: user.verification,
          stats: user.stats,
          isDriver: user.isDriver,
          isPassenger: user.isPassenger,
          memberSince: user.createdAt
        }
      });
    } catch (err) {
      return next(err);
    }
  }
};

module.exports = { usersController };

