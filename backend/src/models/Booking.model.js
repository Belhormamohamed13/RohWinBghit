/**
 * Booking Model
 * Represents trip bookings made by passengers
 */

class BookingModel {
  constructor(knex) {
    this.knex = knex;
    this.tableName = 'bookings';
  }

  /**
   * Create a new booking
   * @param {Object} bookingData - Booking data
   * @returns {Promise<Object>} Created booking
   */
  async create(bookingData) {
    const [booking] = await this.knex(this.tableName)
      .insert({
        trip_id: bookingData.trip_id,
        passenger_id: bookingData.passenger_id,
        num_seats: bookingData.num_seats || 1,
        total_price: bookingData.total_price,
        status: bookingData.status || 'pending',
        payment_status: bookingData.payment_status || 'unpaid',
        payment_method: bookingData.payment_method,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

    return this.format(booking);
  }

  /**
   * Find booking by ID
   * @param {string} id - Booking ID
   * @returns {Promise<Object|null>} Booking object
   */
  async findById(id) {
    const booking = await this.knex(this.tableName)
      .where({ id })
      .first();
    return booking ? this.format(booking) : null;
  }

  /**
   * Find booking by ID with full details
   * @param {string} id - Booking ID
   * @returns {Promise<Object|null>} Booking with details
   */
  async findByIdWithDetails(id) {
    const booking = await this.knex(this.tableName)
      .select(
        'bookings.*',
        'trips.departure_time',
        'trips.from_city',
        'trips.to_city',
        'passenger.first_name as passenger_first_name',
        'passenger.last_name as passenger_last_name',
        'passenger.avatar_url as passenger_avatar',
        'driver.id as driver_id',
        'driver.first_name as driver_first_name',
        'driver.last_name as driver_last_name',
        'driver.avatar_url as driver_avatar'
      )
      .from(this.tableName)
      .join('trips', 'bookings.trip_id', 'trips.id')
      .join('users as passenger', 'bookings.passenger_id', 'passenger.id')
      .join('users as driver', 'trips.driver_id', 'driver.id')
      .where('bookings.id', id)
      .first();

    if (!booking) return null;

    const formatted = this.format(booking);

    formatted.trip = {
      id: booking.trip_id,
      departure_time: booking.departure_time,
      from_city: booking.from_city,
      to_city: booking.to_city,
      driver_id: booking.driver_id,
      driver: {
        id: booking.driver_id,
        first_name: booking.driver_first_name,
        last_name: booking.driver_last_name,
        avatar_url: booking.driver_avatar
      }
    };

    formatted.passenger = {
      id: booking.passenger_id,
      first_name: booking.passenger_first_name,
      last_name: booking.passenger_last_name,
      avatar_url: booking.passenger_avatar
    };

    return formatted;
  }

  /**
   * Find bookings by passenger ID
   * @param {string} passengerId - Passenger ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Bookings list
   */
  async findByPassengerId(passengerId, options = {}) {
    const { status, limit = 20, offset = 0 } = options;

    let query = this.knex(this.tableName)
      .where('passenger_id', passengerId);

    if (status) {
      query = query.where('status', status);
    }

    const bookings = await query
      .limit(limit)
      .offset(offset)
      .orderBy('created_at', 'desc');

    return bookings.map(b => this.format(b));
  }

  /**
   * Find bookings by passenger ID with full details
   * @param {string} passengerId - Passenger ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Bookings list with details
   */
  async findByPassengerIdWithDetails(passengerId, options = {}) {
    const { status, limit = 20, offset = 0 } = options;

    let query = this.knex(this.tableName)
      .select(
        'bookings.*',
        'trips.departure_time',
        'trips.from_city',
        'trips.to_city',
        'driver.id as driver_id',
        'driver.first_name as driver_first_name',
        'driver.last_name as driver_last_name',
        'driver.avatar_url as driver_avatar'
      )
      .from(this.tableName)
      .join('trips', 'bookings.trip_id', 'trips.id')
      .join('users as driver', 'trips.driver_id', 'driver.id')
      .where('bookings.passenger_id', passengerId);

    if (status) {
      query = query.where('bookings.status', status);
    }

    const bookings = await query
      .limit(limit)
      .offset(offset)
      .orderBy('bookings.created_at', 'desc');

    return bookings.map(booking => {
      const formatted = this.format(booking);
      formatted.trip = {
        id: booking.trip_id,
        departure_time: booking.departure_time,
        from_city: booking.from_city,
        to_city: booking.to_city,
        driver_id: booking.driver_id,
        driver: {
          id: booking.driver_id,
          first_name: booking.driver_first_name,
          last_name: booking.driver_last_name,
          avatar_url: booking.driver_avatar
        }
      };
      return formatted;
    });
  }

  /**
   * Find bookings by driver ID
   * @param {string} driverId - Driver ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Bookings list
   */
  async findByDriverId(driverId, options = {}) {
    const { status, limit = 20, offset = 0 } = options;

    const query = this.knex(this.tableName)
      .join('trips', 'bookings.trip_id', 'trips.id')
      .where('trips.driver_id', driverId)
      .select('bookings.*');

    if (status) {
      query.where('bookings.status', status);
    }

    const bookings = await query
      .limit(limit)
      .offset(offset)
      .orderBy('bookings.created_at', 'desc');

    return bookings.map(b => this.format(b));
  }

  /**
   * Find bookings for a specific trip with passenger details
   * @param {string} tripId - Trip ID
   * @returns {Promise<Array>} Bookings list with details
   */
  async findByTripId(tripId) {
    const bookings = await this.knex(this.tableName)
      .select(
        'bookings.*',
        'passenger.first_name as passenger_first_name',
        'passenger.last_name as passenger_last_name',
        'passenger.avatar_url as passenger_avatar'
      )
      .from(this.tableName)
      .join('users as passenger', 'bookings.passenger_id', 'passenger.id')
      .where('bookings.trip_id', tripId)
      .orderBy('bookings.created_at', 'desc');

    return bookings.map(booking => {
      const formatted = this.format(booking);
      formatted.passenger = {
        id: booking.passenger_id,
        first_name: booking.passenger_first_name,
        last_name: booking.passenger_last_name,
        avatar_url: booking.passenger_avatar
      };
      return formatted;
    });
  }


  /**
   * Update booking status
   * @param {string} id - Booking ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated booking
   */
  async updateStatus(id, status) {
    const [booking] = await this.knex(this.tableName)
      .where({ id })
      .update({
        status,
        updated_at: new Date()
      })
      .returning('*');

    return this.format(booking);
  }

  /**
   * Format booking object
   * @param {Object} booking - Raw booking object
   * @returns {Object} Formatted booking
   */
  format(booking) {
    if (!booking) return null;

    return {
      id: booking.id,
      trip_id: booking.trip_id,
      passenger_id: booking.passenger_id,
      num_seats: booking.num_seats,
      total_price: booking.total_price,
      status: booking.status,
      payment_status: booking.payment_status,
      payment_method: booking.payment_method,
      cancel_reason: booking.cancel_reason,
      created_at: booking.created_at,
      updated_at: booking.updated_at
    };
  }
}

module.exports = BookingModel;
