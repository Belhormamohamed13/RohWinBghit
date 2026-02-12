/**
 * Encryption Service
 * AES-256-GCM encryption for sensitive data
 */

const crypto = require('crypto');

class EncryptionService {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32;
    this.ivLength = 16;
    this.authTagLength = 16;
    this.saltLength = 64;
    this.iterations = 100000;
    this.digest = 'sha512';
    
    // Master key from environment
    this.masterKey = process.env.ENCRYPTION_KEY || 'default_master_key_32_chars_long!!';
  }

  /**
   * Derive encryption key from password and salt
   * @param {string} password - Password/key
   * @param {Buffer} salt - Salt
   * @returns {Buffer} Derived key
   */
  deriveKey(password, salt) {
    return crypto.pbkdf2Sync(
      password,
      salt,
      this.iterations,
      this.keyLength,
      this.digest
    );
  }

  /**
   * Encrypt data
   * @param {string} text - Text to encrypt
   * @param {string} keyOverride - Optional custom key
   * @returns {Object} Encrypted data with IV and auth tag
   */
  encrypt(text, keyOverride = null) {
    try {
      if (!text) return null;

      // Generate random salt
      const salt = crypto.randomBytes(this.saltLength);
      
      // Derive key
      const key = this.deriveKey(keyOverride || this.masterKey, salt);
      
      // Generate random IV
      const iv = crypto.randomBytes(this.ivLength);
      
      // Create cipher
      const cipher = crypto.createCipheriv(this.algorithm, key, iv);
      
      // Encrypt
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      // Get auth tag
      const authTag = cipher.getAuthTag();
      
      // Combine salt + iv + authTag + encrypted for storage
      return {
        encrypted: encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex'),
        salt: salt.toString('hex')
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decrypt data
   * @param {Object} encryptedData - Encrypted data object
   * @param {string} keyOverride - Optional custom key
   * @returns {string} Decrypted text
   */
  decrypt(encryptedData, keyOverride = null) {
    try {
      if (!encryptedData || !encryptedData.encrypted) return null;

      const { encrypted, iv, authTag, salt } = encryptedData;
      
      // Convert from hex
      const ivBuffer = Buffer.from(iv, 'hex');
      const authTagBuffer = Buffer.from(authTag, 'hex');
      const saltBuffer = Buffer.from(salt, 'hex');
      
      // Derive key
      const key = this.deriveKey(keyOverride || this.masterKey, saltBuffer);
      
      // Create decipher
      const decipher = crypto.createDecipheriv(this.algorithm, key, ivBuffer);
      decipher.setAuthTag(authTagBuffer);
      
      // Decrypt
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Decryption failed - data may be corrupted or key is incorrect');
    }
  }

  /**
   * Hash data using SHA-256
   * @param {string} data - Data to hash
   * @returns {string} Hash
   */
  hash(data) {
    return crypto
      .createHash('sha256')
      .update(data)
      .digest('hex');
  }

  /**
   * Hash with salt
   * @param {string} data - Data to hash
   * @param {string} salt - Salt
   * @returns {string} Salted hash
   */
  hashWithSalt(data, salt) {
    return crypto
      .createHmac('sha256', salt)
      .update(data)
      .digest('hex');
  }

  /**
   * Generate random token
   * @param {number} length - Token length
   * @returns {string} Random token
   */
  generateToken(length = 32) {
    return crypto
      .randomBytes(length)
      .toString('hex');
  }

  /**
   * Generate secure random string
   * @param {number} length - String length
   * @returns {string} Random string
   */
  generateRandomString(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const randomBytes = crypto.randomBytes(length);
    
    for (let i = 0; i < length; i++) {
      result += chars[randomBytes[i] % chars.length];
    }
    
    return result;
  }

  /**
   * Generate QR code data for booking
   * @param {Object} bookingData - Booking data
   * @returns {string} QR code data string
   */
  generateQRCodeData(bookingData) {
    const data = {
      b: bookingData.bookingId,
      t: bookingData.tripId,
      p: bookingData.passengerId,
      s: bookingData.seats,
      ts: Date.now()
    };
    
    // Create a signed hash to prevent tampering
    const dataString = JSON.stringify(data);
    const signature = this.hash(dataString + this.masterKey);
    
    return Buffer.from(JSON.stringify({
      d: data,
      s: signature.substring(0, 16) // Short signature for QR
    })).toString('base64');
  }

  /**
   * Verify QR code data
   * @param {string} qrData - QR code data
   * @returns {Object|null} Verified data or null
   */
  verifyQRCodeData(qrData) {
    try {
      const parsed = JSON.parse(Buffer.from(qrData, 'base64').toString());
      const { d, s } = parsed;
      
      // Verify signature
      const dataString = JSON.stringify(d);
      const expectedSignature = this.hash(dataString + this.masterKey).substring(0, 16);
      
      if (s !== expectedSignature) {
        return null;
      }
      
      return d;
    } catch (error) {
      return null;
    }
  }

  /**
   * Mask sensitive data
   * @param {string} data - Data to mask
   * @param {number} visibleStart - Visible chars at start
   * @param {number} visibleEnd - Visible chars at end
   * @returns {string} Masked data
   */
  mask(data, visibleStart = 2, visibleEnd = 2) {
    if (!data || data.length <= visibleStart + visibleEnd) {
      return data;
    }
    
    const start = data.substring(0, visibleStart);
    const end = data.substring(data.length - visibleEnd);
    const masked = '*'.repeat(data.length - visibleStart - visibleEnd);
    
    return `${start}${masked}${end}`;
  }

  /**
   * Encrypt object fields selectively
   * @param {Object} obj - Object to encrypt
   * @param {Array<string>} fields - Fields to encrypt
   * @returns {Object} Object with encrypted fields
   */
  encryptFields(obj, fields) {
    const encrypted = { ...obj };
    
    for (const field of fields) {
      if (obj[field]) {
        encrypted[field] = this.encrypt(obj[field]);
      }
    }
    
    return encrypted;
  }

  /**
   * Decrypt object fields selectively
   * @param {Object} obj - Object with encrypted fields
   * @param {Array<string>} fields - Fields to decrypt
   * @returns {Object} Object with decrypted fields
   */
  decryptFields(obj, fields) {
    const decrypted = { ...obj };
    
    for (const field of fields) {
      if (obj[field] && typeof obj[field] === 'object' && obj[field].encrypted) {
        decrypted[field] = this.decrypt(obj[field]);
      }
    }
    
    return decrypted;
  }
}

// Export singleton instance
module.exports = new EncryptionService();
