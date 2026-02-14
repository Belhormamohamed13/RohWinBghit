/**
 * Token Blacklist
 * In-memory token blacklist for logout functionality
 * Note: For production, consider using Redis for distributed systems
 */

class TokenBlacklist {
    constructor() {
        this.blacklist = new Set();
        this.expiryTimes = new Map();
        this.cleanupInterval = null;
    }

    /**
     * Add token to blacklist
     * @param {string} token - JWT token to blacklist
     * @param {number} expirySeconds - Seconds until token naturally expires
     */
    add(token, expirySeconds = 900) { // Default 15 minutes (JWT expiry)
        this.blacklist.add(token);
        const expiryTime = Date.now() + (expirySeconds * 1000);
        this.expiryTimes.set(token, expiryTime);

        // Schedule cleanup if not already running
        if (!this.cleanupInterval) {
            this.startCleanup();
        }
    }

    /**
     * Check if token is blacklisted
     * @param {string} token - JWT token to check
     * @returns {boolean} True if token is blacklisted
     */
    has(token) {
        return this.blacklist.has(token);
    }

    /**
     * Remove token from blacklist
     * @param {string} token - JWT token to remove
     */
    remove(token) {
        this.blacklist.delete(token);
        this.expiryTimes.delete(token);
    }

    /**
     * Clean up expired tokens from blacklist
     */
    cleanup() {
        const now = Date.now();
        for (const [token, expiryTime] of this.expiryTimes.entries()) {
            if (expiryTime < now) {
                this.blacklist.delete(token);
                this.expiryTimes.delete(token);
            }
        }

        // Stop cleanup if blacklist is empty
        if (this.blacklist.size === 0 && this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }

    /**
     * Start periodic cleanup of expired tokens
     */
    startCleanup() {
        // Clean up every 5 minutes
        this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000);
    }

    /**
     * Get blacklist size (for monitoring)
     * @returns {number} Number of blacklisted tokens
     */
    size() {
        return this.blacklist.size;
    }
}

// Export singleton instance
module.exports = new TokenBlacklist();
