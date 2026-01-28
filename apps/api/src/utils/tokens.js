const jwt = require("jsonwebtoken");

const { env } = require("../config/env");

function signAccessToken(userId) {
  return jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_TTL_SECONDS
  });
}

function signRefreshToken(userId, tokenId) {
  return jwt.sign({ sub: userId, jti: tokenId }, env.JWT_REFRESH_SECRET, {
    expiresIn: `${env.JWT_REFRESH_TTL_DAYS}d`
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET);
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};

