/**
 * JWT Utility
 * Token generation and verification
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

class JWTUtil {
  /**
   * Generate access token
   * @param {Object} payload - Token payload
   * @returns {string} JWT token
   */
  static generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'rohwinbghit',
      audience: 'rohwinbghit-users'
    });
  }

  /**
   * Generate refresh token
   * @param {Object} payload - Token payload
   * @returns {string} Refresh token
   */
  static generateRefreshToken(payload) {
    return jwt.sign(
      { ...payload, type: 'refresh' },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRES_IN }
    );
  }

  /**
   * Verify access token
   * @param {string} token - JWT token
   * @returns {Object} Decoded payload
   */
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error(`Invalid token: ${error.message}`);
    }
  }

  /**
   * Verify refresh token
   * @param {string} token - Refresh token
   * @returns {Object} Decoded payload
   */
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error(`Invalid refresh token: ${error.message}`);
    }
  }

  /**
   * Decode token without verification
   * @param {string} token - JWT token
   * @returns {Object} Decoded payload
   */
  static decode(token) {
    return jwt.decode(token);
  }

  /**
   * Generate token pair
   * @param {Object} user - User object
   * @returns {Object} Token pair
   */
  static generateTokenPair(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken({ userId: user.id });

    return {
      accessToken,
      refreshToken,
      expiresIn: JWT_EXPIRES_IN,
      tokenType: 'Bearer'
    };
  }

  /**
   * Get token expiration time
   * @param {string} token - JWT token
   * @returns {number} Expiration timestamp
   */
  static getExpirationTime(token) {
    const decoded = this.decode(token);
    return decoded ? decoded.exp : null;
  }

  /**
   * Check if token is expired
   * @param {string} token - JWT token
   * @returns {boolean} Is expired
   */
  static isExpired(token) {
    const exp = this.getExpirationTime(token);
    if (!exp) return true;
    return Date.now() >= exp * 1000;
  }

  /**
   * Get time until expiration
   * @param {string} token - JWT token
   * @returns {number} Milliseconds until expiration
   */
  static getTimeUntilExpiration(token) {
    const exp = this.getExpirationTime(token);
    if (!exp) return 0;
    return Math.max(0, exp * 1000 - Date.now());
  }
}

module.exports = JWTUtil;
