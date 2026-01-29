const createError = require("http-errors");

const { authService } = require("../services/auth.service");

const REFRESH_COOKIE = "rw_refresh";

const refreshCookieOptions = () => {
  const isSecure = String(process.env.COOKIE_SECURE) === "true";
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isSecure,
    path: "/api/auth/refresh"
  };
};

const authController = {
  async register(req, res, next) {
    try {
      const { body } = req.validated;
      const result = await authService.register(body);
      res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions());
      return res.status(201).json({
        success: true,
        data: { user: result.user, accessToken: result.accessToken }
      });
    } catch (err) {
      return next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { body } = req.validated;
      const result = await authService.login(body);
      res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions());
      return res.json({
        success: true,
        data: { user: result.user, accessToken: result.accessToken }
      });
    } catch (err) {
      return next(err);
    }
  },

  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies?.[REFRESH_COOKIE];
      if (!refreshToken) throw createError(401, "Missing refresh token");

      const result = await authService.refresh(refreshToken);
      res.cookie(REFRESH_COOKIE, result.refreshToken, refreshCookieOptions());
      return res.json({
        success: true,
        data: { accessToken: result.accessToken }
      });
    } catch (err) {
      return next(err);
    }
  },

  async logout(req, res, next) {
    try {
      res.clearCookie(REFRESH_COOKIE, { path: "/api/auth/refresh" });
      return res.json({ success: true, data: { loggedOut: true } });
    } catch (err) {
      return next(err);
    }
  }
};

module.exports = { authController };

