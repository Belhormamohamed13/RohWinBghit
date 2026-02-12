/**
 * Trip Model
 * Represents trips/carpool rides published by drivers
 */

class TripModel {
  constructor(knex) {
    this.knex = knex;
    this.tableName = 'trips';
  }

  /**
   * Create a new trip
   * @param {Object} tripData - Trip data
   * @returns {Promise<Object>} Created trip
   */
  async create(tripData) {
    const [trip] = await this.knex(this.tableName)
      .insert({
        driver_id: tripData.driverId,
        vehicle_id: tripData.vehicleId,
        from_wilaya_id: tripData.fromWilayaId,
        from_city: tripData.fromCity,
        from_address: tripData.fromAddress,
        from_latitude: tripData.fromLatitude,
        from_longitude: tripData.fromLongitude,
        to_wilaya_id: tripData.toWilayaId,
        to_city: tripData.toCity,
        to_address: tripData.toAddress,
        to_latitude: tripData.toLatitude,
        to_longitude: tripData.toLongitude,
        departure_date: tripData.departureDate,
        departure_time: `${tripData.departureDate} ${tripData.departureTime}:00`,
        estimated_arrival: tripData.estimatedArrival,
        distance_km: tripData.distanceKm,
        duration_minutes: tripData.durationMinutes,
        available_seats: tripData.availableSeats,
        total_seats: tripData.availableSeats, // Initial capacity equals available seats
        price_per_seat: tripData.pricePerSeat,
        total_price: tripData.totalPrice,
        pricing_strategy: tripData.pricingStrategy || 'standard',
        luggage_allowed: tripData.luggageAllowed !== undefined ? tripData.luggageAllowed : true,
        max_luggage_size: tripData.maxLuggageSize || 'medium',
        smoking_allowed: tripData.smokingAllowed || false,
        pets_allowed: tripData.petsAllowed || false,
        instant_booking: tripData.instantBooking || false,
        description: tripData.description,
        status: 'active', // matched migration default
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

    return this.format(trip);
  }

  /**
   * Find trip by ID
   * @param {string} id - Trip ID
   * @returns {Promise<Object|null>} Trip object
   */
  async findById(id) {
    const trip = await this.knex(this.tableName)
      .where({ id })
      .first();
    return trip ? this.format(trip) : null;
  }

  /**
   * Find trip by ID with driver details
   * @param {string} id - Trip ID
   * @returns {Promise<Object|null>} Trip with driver
   */
  async findByIdWithDriver(id) {
    const trip = await this.knex(this.tableName)
      .select('trips.*',
        'users.first_name as driver_first_name',
        'users.last_name as driver_last_name',
        'users.avatar_url as driver_avatar',
        'users.phone as driver_phone'
      )
      .from(this.tableName)
      .join('users', 'trips.driver_id', 'users.id')
      .where('trips.id', id)
      .first();

    if (!trip) return null;

    const formatted = this.format(trip);
    formatted.driver = {
      id: trip.driver_id,
      firstName: trip.driver_first_name,
      lastName: trip.driver_last_name,
      fullName: `${trip.driver_first_name} ${trip.driver_last_name}`,
      avatarUrl: trip.driver_avatar,
      phone: trip.driver_phone
    };

    return formatted;
  }

  /**
   * Search trips with filters
   * @param {Object} filters - Search filters
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Trips list
   */
  async search(filters, options = {}) {
    const {
      fromWilayaId,
      toWilayaId,
      date,
      seats = 1,
      minPrice,
      maxPrice,
      vehicleType,
      instantBooking,
      luggageAllowed,
      petsAllowed
    } = filters;

    const { limit = 20, offset = 0, sortBy = 'departure_date', sortOrder = 'asc' } = options;

    let query = this.knex(this.tableName)
      .where('status', 'active')
      .where('available_seats', '>=', seats)
      .where('departure_date', '>=', new Date().toISOString().split('T')[0]);

    if (fromWilayaId) {
      query = query.where('from_wilaya_id', fromWilayaId);
    }

    if (toWilayaId) {
      query = query.where('to_wilaya_id', toWilayaId);
    }

    if (date) {
      query = query.where('departure_date', date);
    }

    if (minPrice !== undefined) {
      query = query.where('price_per_seat', '>=', minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.where('price_per_seat', '<=', maxPrice);
    }

    if (instantBooking !== undefined) {
      query = query.where('instant_booking', instantBooking);
    }

    if (luggageAllowed !== undefined) {
      query = query.where('luggage_allowed', luggageAllowed);
    }

    if (petsAllowed !== undefined) {
      query = query.where('pets_allowed', petsAllowed);
    }

    // Join with vehicles for vehicle type filter
    if (vehicleType) {
      query = query
        .join('vehicles', 'trips.vehicle_id', 'vehicles.id')
        .where('vehicles.vehicle_type', vehicleType);
    }

    const trips = await query
      .limit(limit)
      .offset(offset)
      .orderBy(sortBy, sortOrder);

    return trips.map(t => this.format(t));
  }

  /**
   * Find trips by driver ID
   * @param {string} driverId - Driver ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Trips list
   */
  async findByDriverId(driverId, options = {}) {
    const { status, limit = 20, offset = 0 } = options;

    let query = this.knex(this.tableName)
      .where('driver_id', driverId);

    if (status) {
      query = query.where('status', status);
    }

    const trips = await query
      .limit(limit)
      .offset(offset)
      .orderBy('departure_date', 'desc')
      .orderBy('departure_time', 'desc');

    return trips.map(t => this.format(t));
  }

  /**
   * Update trip
   * @param {string} id - Trip ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated trip
   */
  async update(id, updateData) {
    const data = {
      updated_at: new Date()
    };

    // Map fields
    const fieldMapping = {
      availableSeats: 'available_seats',
      pricePerSeat: 'price_per_seat',
      status: 'status',
      description: 'description',
      instantBooking: 'instant_booking',
      smokingAllowed: 'smoking_allowed',
      petsAllowed: 'pets_allowed'
    };

    for (const [key, dbField] of Object.entries(fieldMapping)) {
      if (updateData[key] !== undefined) {
        data[dbField] = updateData[key];
      }
    }

    const [trip] = await this.knex(this.tableName)
      .where({ id })
      .update(data)
      .returning('*');

    return this.format(trip);
  }

  /**
   * Update trip status
   * @param {string} id - Trip ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated trip
   */
  async updateStatus(id, status) {
    const updateData = {
      status,
      updated_at: new Date()
    };

    if (status === 'in_progress') {
      updateData.started_at = new Date();
    } else if (status === 'completed') {
      updateData.completed_at = new Date();
    } else if (status === 'cancelled') {
      updateData.cancelled_at = new Date();
    }

    const [trip] = await this.knex(this.tableName)
      .where({ id })
      .update(updateData)
      .returning('*');

    return this.format(trip);
  }

  /**
   * Decrement available seats
   * @param {string} id - Trip ID
   * @param {number} seats - Number of seats to decrement
   * @returns {Promise<boolean>} Success
   */
  async decrementSeats(id, seats = 1) {
    const result = await this.knex(this.tableName)
      .where({ id })
      .where('available_seats', '>=', seats)
      .decrement('available_seats', seats);

    return result > 0;
  }

  /**
   * Increment available seats
   * @param {string} id - Trip ID
   * @param {number} seats - Number of seats to increment
   * @returns {Promise<void>}
   */
  async incrementSeats(id, seats = 1) {
    await this.knex(this.tableName)
      .where({ id })
      .increment('available_seats', seats);
  }

  /**
   * Cancel trip
   * @param {string} id - Trip ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise<Object>} Cancelled trip
   */
  async cancel(id, reason) {
    const [trip] = await this.knex(this.tableName)
      .where({ id })
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
        cancelled_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

    return this.format(trip);
  }

  /**
   * Delete trip (soft delete)
   * @param {string} id - Trip ID
   * @returns {Promise<void>}
   */
  async delete(id) {
    await this.knex(this.tableName)
      .where({ id })
      .update({
        status: 'deleted',
        deleted_at: new Date(),
        updated_at: new Date()
      });
  }

  /**
   * Format trip object
   * @param {Object} trip - Raw trip object
   * @returns {Object} Formatted trip
   */
  format(trip) {
    if (!trip) return null;

    return {
      id: trip.id,
      driverId: trip.driver_id,
      vehicleId: trip.vehicle_id,
      from: {
        wilayaId: trip.from_wilaya_id,
        city: trip.from_city,
        address: trip.from_address,
        latitude: trip.from_latitude,
        longitude: trip.from_longitude
      },
      to: {
        wilayaId: trip.to_wilaya_id,
        city: trip.to_city,
        address: trip.to_address,
        latitude: trip.to_latitude,
        longitude: trip.to_longitude
      },
      departure: {
        date: trip.departure_date,
        time: trip.departure_time
      },
      estimatedArrival: trip.estimated_arrival,
      distance: {
        km: trip.distance_km,
        durationMinutes: trip.duration_minutes
      },
      seats: {
        available: trip.available_seats,
        total: trip.total_seats
      },
      pricing: {
        perSeat: trip.price_per_seat,
        total: trip.total_price,
        strategy: trip.pricing_strategy
      },
      options: {
        luggageAllowed: trip.luggage_allowed,
        maxLuggageSize: trip.max_luggage_size,
        smokingAllowed: trip.smoking_allowed,
        petsAllowed: trip.pets_allowed,
        instantBooking: trip.instant_booking
      },
      description: trip.description,
      status: trip.status,
      timestamps: {
        startedAt: trip.started_at,
        completedAt: trip.completed_at,
        cancelledAt: trip.cancelled_at,
        createdAt: trip.created_at,
        updatedAt: trip.updated_at
      }
    };
  }

  /**
   * Get trip statistics
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics() {
    return await this.knex(this.tableName)
      .select(
        this.knex.raw('COUNT(*) as total_trips'),
        this.knex.raw("COUNT(CASE WHEN status IN ('active', 'scheduled') THEN 1 END) as scheduled"),
        this.knex.raw("COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress"),
        this.knex.raw("COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed"),
        this.knex.raw("COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled"),
        this.knex.raw("COUNT(CASE WHEN departure_time::date = CURRENT_DATE THEN 1 END) as today_trips"),
        this.knex.raw("COALESCE(SUM(CASE WHEN status = 'completed' THEN price_per_seat * (COALESCE(total_seats, available_seats) - available_seats) ELSE 0 END), 0) as total_revenue")
      )
      .first();
  }
}

module.exports = TripModel;
