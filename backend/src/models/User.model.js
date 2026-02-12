/**
 * User Model
 * Represents users in the system (passengers, drivers, admins)
 */

const bcrypt = require('bcryptjs');

class UserModel {
  constructor(knex) {
    this.knex = knex;
    this.tableName = 'users';
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user
   */
  async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const [user] = await this.knex(this.tableName)
      .insert({
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        phone: userData.phone,
        first_name: userData.firstName,
        last_name: userData.lastName,
        date_of_birth: userData.dateOfBirth,
        gender: userData.gender,
        avatar_url: userData.avatarUrl,
        role: userData.role || 'passenger',
        is_verified: false,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

    return this.sanitize(user);
  }

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} User object
   */
  async findById(id) {
    const user = await this.knex(this.tableName)
      .where({ id, is_active: true })
      .first();
    return user ? this.sanitize(user) : null;
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object
   */
  async findByEmail(email) {
    const user = await this.knex(this.tableName)
      .where({ email: email.toLowerCase(), is_active: true })
      .first();
    return user || null;
  }

  /**
   * Find user by phone
   * @param {string} phone - Phone number
   * @returns {Promise<Object|null>} User object
   */
  async findByPhone(phone) {
    const user = await this.knex(this.tableName)
      .where({ phone, is_active: true })
      .first();
    return user || null;
  }

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  async update(id, updateData) {
    const data = {
      ...updateData,
      updated_at: new Date()
    };

    if (updateData.password) {
      data.password = await bcrypt.hash(updateData.password, 12);
    }

    const [user] = await this.knex(this.tableName)
      .where({ id })
      .update(data)
      .returning('*');

    return this.sanitize(user);
  }

  /**
   * Verify user email
   * @param {string} id - User ID
   * @returns {Promise<Object>} Updated user
   */
  async verifyEmail(id) {
    const [user] = await this.knex(this.tableName)
      .where({ id })
      .update({
        is_verified: true,
        email_verified_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

    return this.sanitize(user);
  }

  /**
   * Update last login
   * @param {string} id - User ID
   * @returns {Promise<void>}
   */
  async updateLastLogin(id) {
    await this.knex(this.tableName)
      .where({ id })
      .update({
        last_login_at: new Date(),
        updated_at: new Date()
      });
  }

  /**
   * Update FCM token
   * @param {string} id - User ID
   * @param {string} fcmToken - FCM token
   * @returns {Promise<void>}
   */
  async updateFcmToken(id, fcmToken) {
    await this.knex(this.tableName)
      .where({ id })
      .update({
        fcm_token: fcmToken,
        updated_at: new Date()
      });
  }

  /**
   * Soft delete user
   * @param {string} id - User ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    await this.knex(this.tableName)
      .where({ id })
      .update({
        is_active: false,
        deleted_at: new Date(),
        updated_at: new Date()
      });
  }

  /**
   * Compare password
   * @param {string} password - Plain password
   * @param {string} hashedPassword - Hashed password
   * @returns {Promise<boolean>} Match result
   */
  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  /**
   * Get users by role
   * @param {string} role - User role
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Users list
   */
  async findByRole(role, options = {}) {
    const { limit = 20, offset = 0 } = options;

    const users = await this.knex(this.tableName)
      .where({ role, is_active: true })
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc');

    return users.map(u => this.sanitize(u));
  }

  /**
   * Search users
   * @param {string} query - Search query
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Search results
   */
  async search(query, options = {}) {
    const { limit = 20, offset = 0 } = options;

    const users = await this.knex(this.tableName)
      .where(function () {
        this.where('first_name', 'ilike', `%${query}%`)
          .orWhere('last_name', 'ilike', `%${query}%`)
          .orWhere('email', 'ilike', `%${query}%`)
          .orWhere('phone', 'ilike', `%${query}%`);
      })
      .andWhere({ is_active: true })
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc');

    return users.map(u => this.sanitize(u));
  }

  /**
   * Get user statistics
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics() {
    return await this.knex(this.tableName)
      .where({ is_active: true })
      .select(
        this.knex.raw('COUNT(*) as total_users'),
        this.knex.raw("COUNT(CASE WHEN role = 'passenger' THEN 1 END) as passengers"),
        this.knex.raw("COUNT(CASE WHEN role = 'driver' THEN 1 END) as drivers"),
        this.knex.raw("COUNT(CASE WHEN role = 'admin' THEN 1 END) as admins"),
        this.knex.raw("COUNT(CASE WHEN is_verified = true THEN 1 END) as verified_users"),
        this.knex.raw("COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as new_users_30d")
      )
      .first();
  }

  /**
   * Sanitize user object (remove sensitive data)
   * @param {Object} user - Raw user object
   * @returns {Object} Sanitized user
   */
  sanitize(user) {
    if (!user) return null;

    const { password, ...sanitized } = user;
    return {
      id: sanitized.id,
      email: sanitized.email,
      phone: sanitized.phone,
      firstName: sanitized.first_name,
      lastName: sanitized.last_name,
      fullName: `${sanitized.first_name} ${sanitized.last_name}`,
      dateOfBirth: sanitized.date_of_birth,
      gender: sanitized.gender,
      avatarUrl: sanitized.avatar_url,
      role: sanitized.role,
      isVerified: sanitized.is_verified,
      verificationStatus: sanitized.verification_status,
      identityCardFrontUrl: sanitized.identity_card_front_url,
      identityCardBackUrl: sanitized.identity_card_back_url,
      licenseFrontUrl: sanitized.license_front_url,
      licenseBackUrl: sanitized.license_back_url,
      verificationNotes: sanitized.verification_notes,
      verifiedAt: sanitized.verified_at,
      isActive: sanitized.is_active,
      emailVerifiedAt: sanitized.email_verified_at,
      lastLoginAt: sanitized.last_login_at,
      createdAt: sanitized.created_at,
      updatedAt: sanitized.updated_at
    };
  }
}

module.exports = UserModel;
