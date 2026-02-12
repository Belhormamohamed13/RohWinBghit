/**
 * Review Model
 * Represents user reviews and ratings for trips
 */

class ReviewModel {
  constructor(knex) {
    this.knex = knex;
    this.tableName = 'reviews';
  }

  /**
   * Create a new review
   * @param {Object} reviewData - Review data
   * @returns {Promise<Object>} Created review
   */
  async create(reviewData) {
    const [review] = await this.knex(this.tableName)
      .insert({
        booking_id: reviewData.bookingId,
        trip_id: reviewData.tripId,
        reviewer_id: reviewData.reviewerId,
        reviewee_id: reviewData.revieweeId,
        review_type: reviewData.reviewType, // 'passenger_to_driver' or 'driver_to_passenger'
        rating: reviewData.rating, // 1-5
        punctuality_rating: reviewData.punctualityRating,
        cleanliness_rating: reviewData.cleanlinessRating,
        communication_rating: reviewData.communicationRating,
        driving_rating: reviewData.drivingRating,
        comment: reviewData.comment,
        is_anonymous: reviewData.isAnonymous || false,
        is_flagged: false,
        flag_reason: null,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

    return this.format(review);
  }

  /**
   * Find review by ID
   * @param {string} id - Review ID
   * @returns {Promise<Object|null>} Review object
   */
  async findById(id) {
    const review = await this.knex(this.tableName)
      .where({ id, is_active: true })
      .first();
    return review ? this.format(review) : null;
  }

  /**
   * Find review by booking ID and reviewer
   * @param {string} bookingId - Booking ID
   * @param {string} reviewerId - Reviewer ID
   * @returns {Promise<Object|null>} Review object
   */
  async findByBookingAndReviewer(bookingId, reviewerId) {
    const review = await this.knex(this.tableName)
      .where({ 
        booking_id: bookingId, 
        reviewer_id: reviewerId,
        is_active: true 
      })
      .first();
    return review ? this.format(review) : null;
  }

  /**
   * Find reviews by trip ID
   * @param {string} tripId - Trip ID
   * @returns {Promise<Array>} Reviews list
   */
  async findByTripId(tripId) {
    const reviews = await this.knex(this.tableName)
      .where({ trip_id: tripId, is_active: true })
      .orderBy('created_at', 'desc');

    return reviews.map(r => this.format(r));
  }

  /**
   * Find reviews by reviewee (user being reviewed)
   * @param {string} revieweeId - Reviewee ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Reviews list
   */
  async findByRevieweeId(revieweeId, options = {}) {
    const { limit = 20, offset = 0 } = options;

    const reviews = await this.knex(this.tableName)
      .select('reviews.*', 
        'reviewer.first_name as reviewer_first_name',
        'reviewer.last_name as reviewer_last_name',
        'reviewer.avatar_url as reviewer_avatar'
      )
      .from(this.tableName)
      .join('users as reviewer', 'reviews.reviewer_id', 'reviewer.id')
      .where('reviews.reviewee_id', revieweeId)
      .where('reviews.is_active', true)
      .limit(limit)
      .offset(offset)
      .orderBy('reviews.created_at', 'desc');

    return reviews.map(r => ({
      ...this.format(r),
      reviewer: {
        firstName: r.reviewer_first_name,
        lastName: r.reviewer_last_name,
        fullName: r.is_anonymous ? 'Anonymous' : `${r.reviewer_first_name} ${r.reviewer_last_name}`,
        avatarUrl: r.is_anonymous ? null : r.reviewer_avatar
      }
    }));
  }

  /**
   * Find reviews by reviewer
   * @param {string} reviewerId - Reviewer ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Reviews list
   */
  async findByReviewerId(reviewerId, options = {}) {
    const { limit = 20, offset = 0 } = options;

    const reviews = await this.knex(this.tableName)
      .where({ reviewer_id: reviewerId, is_active: true })
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc');

    return reviews.map(r => this.format(r));
  }

  /**
   * Update review
   * @param {string} id - Review ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated review
   */
  async update(id, updateData) {
    const data = {
      updated_at: new Date()
    };

    if (updateData.rating !== undefined) data.rating = updateData.rating;
    if (updateData.comment !== undefined) data.comment = updateData.comment;
    if (updateData.isAnonymous !== undefined) data.is_anonymous = updateData.isAnonymous;

    const [review] = await this.knex(this.tableName)
      .where({ id })
      .update(data)
      .returning('*');

    return this.format(review);
  }

  /**
   * Flag review
   * @param {string} id - Review ID
   * @param {string} reason - Flag reason
   * @returns {Promise<Object>} Flagged review
   */
  async flag(id, reason) {
    const [review] = await this.knex(this.tableName)
      .where({ id })
      .update({
        is_flagged: true,
        flag_reason: reason,
        updated_at: new Date()
      })
      .returning('*');

    return this.format(review);
  }

  /**
   * Delete review (soft delete)
   * @param {string} id - Review ID
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
   * Get user's average rating
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Rating statistics
   */
  async getUserRating(userId) {
    const stats = await this.knex(this.tableName)
      .where({ reviewee_id: userId, is_active: true })
      .select(
        this.knex.raw('COUNT(*) as total_reviews'),
        this.knex.raw('AVG(rating) as average_rating'),
        this.knex.raw('COUNT(*) FILTER (WHERE rating = 5) as five_star'),
        this.knex.raw('COUNT(*) FILTER (WHERE rating = 4) as four_star'),
        this.knex.raw('COUNT(*) FILTER (WHERE rating = 3) as three_star'),
        this.knex.raw('COUNT(*) FILTER (WHERE rating = 2) as two_star'),
        this.knex.raw('COUNT(*) FILTER (WHERE rating = 1) as one_star')
      )
      .first();

    return {
      averageRating: stats.average_rating ? Math.round(stats.average_rating * 10) / 10 : 0,
      totalReviews: parseInt(stats.total_reviews) || 0,
      distribution: {
        5: parseInt(stats.five_star) || 0,
        4: parseInt(stats.four_star) || 0,
        3: parseInt(stats.three_star) || 0,
        2: parseInt(stats.two_star) || 0,
        1: parseInt(stats.one_star) || 0
      }
    };
  }

  /**
   * Check if user can review booking
   * @param {string} bookingId - Booking ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>}
   */
  async canReview(bookingId, userId) {
    // Check if booking exists and is completed
    const booking = await this.knex('bookings')
      .where({ id: bookingId })
      .where('booking_status', 'completed')
      .where(function() {
        this.where('passenger_id', userId)
          .orWhere('driver_id', userId);
      })
      .first();

    if (!booking) return false;

    // Check if already reviewed
    const existingReview = await this.knex(this.tableName)
      .where({
        booking_id: bookingId,
        reviewer_id: userId,
        is_active: true
      })
      .first();

    return !existingReview;
  }

  /**
   * Format review object
   * @param {Object} review - Raw review object
   * @returns {Object} Formatted review
   */
  format(review) {
    if (!review) return null;

    return {
      id: review.id,
      bookingId: review.booking_id,
      tripId: review.trip_id,
      reviewerId: review.reviewer_id,
      revieweeId: review.reviewee_id,
      reviewType: review.review_type,
      ratings: {
        overall: review.rating,
        punctuality: review.punctuality_rating,
        cleanliness: review.cleanliness_rating,
        communication: review.communication_rating,
        driving: review.driving_rating
      },
      comment: review.comment,
      isAnonymous: review.is_anonymous,
      isFlagged: review.is_flagged,
      flagReason: review.flag_reason,
      isActive: review.is_active,
      createdAt: review.created_at,
      updatedAt: review.updated_at
    };
  }

  /**
   * Get review statistics
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics() {
    const stats = await this.knex(this.tableName)
      .where({ is_active: true })
      .select(
        this.knex.raw('COUNT(*) as total_reviews'),
        this.knex.raw('AVG(rating) as average_rating'),
        this.knex.raw("COUNT(*) FILTER (WHERE review_type = 'passenger_to_driver') as passenger_reviews"),
        this.knex.raw("COUNT(*) FILTER (WHERE review_type = 'driver_to_passenger') as driver_reviews"),
        this.knex.raw("COUNT(*) FILTER (WHERE is_flagged = true) as flagged_reviews")
      )
      .first();

    return stats;
  }
}

module.exports = ReviewModel;
