/**
 * Route Model
 * Represents popular routes between wilayas with distance and duration
 */

class RouteModel {
  constructor(knex) {
    this.knex = knex;
    this.tableName = 'routes';
  }

  /**
   * Create a new route
   * @param {Object} routeData - Route data
   * @returns {Promise<Object>} Created route
   */
  async create(routeData) {
    const [route] = await this.knex(this.tableName)
      .insert({
        from_wilaya_id: routeData.fromWilayaId,
        to_wilaya_id: routeData.toWilayaId,
        from_city: routeData.fromCity,
        to_city: routeData.toCity,
        distance_km: routeData.distanceKm,
        duration_minutes: routeData.durationMinutes,
        toll_cost: routeData.tollCost || 0,
        fuel_cost_estimate: routeData.fuelCostEstimate,
        route_geometry: routeData.routeGeometry, // GeoJSON
        waypoints: routeData.waypoints,
        is_popular: routeData.isPopular || false,
        trip_count: 0,
        average_price: routeData.averagePrice,
        created_at: new Date(),
        updated_at: new Date()
      })
      .returning('*');

    return this.format(route);
  }

  /**
   * Find route by ID
   * @param {string} id - Route ID
   * @returns {Promise<Object|null>} Route object
   */
  async findById(id) {
    const route = await this.knex(this.tableName)
      .where({ id })
      .first();
    return route ? this.format(route) : null;
  }

  /**
   * Find route by origin and destination
   * @param {number} fromWilayaId - Origin wilaya code
   * @param {number} toWilayaId - Destination wilaya code
   * @returns {Promise<Object|null>} Route object
   */
  async findByEndpoints(fromWilayaId, toWilayaId) {
    const route = await this.knex(this.tableName)
      .where({
        from_wilaya_id: fromWilayaId,
        to_wilaya_id: toWilayaId
      })
      .first();
    return route ? this.format(route) : null;
  }

  /**
   * Find or create route
   * @param {number} fromWilayaId - Origin wilaya code
   * @param {number} toWilayaId - Destination wilaya code
   * @returns {Promise<Object>} Route object
   */
  async findOrCreate(fromWilayaId, toWilayaId) {
    let route = await this.findByEndpoints(fromWilayaId, toWilayaId);
    
    if (!route) {
      // Calculate distance using WilayaModel
      const WilayaModel = require('./Wilaya.model');
      const wilayaModel = new WilayaModel(this.knex);
      
      const distanceInfo = await wilayaModel.calculateDistance(fromWilayaId, toWilayaId);
      
      route = await this.create({
        fromWilayaId,
        toWilayaId,
        fromCity: distanceInfo.from.name,
        toCity: distanceInfo.to.name,
        distanceKm: distanceInfo.distanceKm,
        durationMinutes: distanceInfo.estimatedDurationMinutes,
        averagePrice: this.calculateAveragePrice(distanceInfo.distanceKm)
      });
    }

    return route;
  }

  /**
   * Get all routes
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Routes list
   */
  async findAll(options = {}) {
    const { limit = 100, offset = 0, popularOnly = false } = options;

    let query = this.knex(this.tableName);

    if (popularOnly) {
      query = query.where('is_popular', true);
    }

    const routes = await query
      .limit(limit)
      .offset(offset)
      .orderBy('trip_count', 'desc');

    return routes.map(r => this.format(r));
  }

  /**
   * Get popular routes
   * @param {number} limit - Number of routes
   * @returns {Promise<Array>} Popular routes
   */
  async getPopular(limit = 10) {
    const routes = await this.knex(this.tableName)
      .select('routes.*',
        'from_wilaya.name as from_wilaya_name',
        'from_wilaya.name_ar as from_wilaya_name_ar',
        'to_wilaya.name as to_wilaya_name',
        'to_wilaya.name_ar as to_wilaya_name_ar'
      )
      .join('wilayas as from_wilaya', 'routes.from_wilaya_id', 'from_wilaya.code')
      .join('wilayas as to_wilaya', 'routes.to_wilaya_id', 'to_wilaya.code')
      .orderBy('trip_count', 'desc')
      .limit(limit);

    return routes.map(r => ({
      ...this.format(r),
      fromWilaya: {
        name: r.from_wilaya_name,
        nameAr: r.from_wilaya_name_ar
      },
      toWilaya: {
        name: r.to_wilaya_name,
        nameAr: r.to_wilaya_name_ar
      }
    }));
  }

  /**
   * Get routes from a specific wilaya
   * @param {number} fromWilayaId - Origin wilaya code
   * @returns {Promise<Array>} Routes list
   */
  async getRoutesFrom(fromWilayaId) {
    const routes = await this.knex(this.tableName)
      .select('routes.*',
        'to_wilaya.name as to_wilaya_name',
        'to_wilaya.name_ar as to_wilaya_name_ar'
      )
      .join('wilayas as to_wilaya', 'routes.to_wilaya_id', 'to_wilaya.code')
      .where('routes.from_wilaya_id', fromWilayaId)
      .orderBy('trip_count', 'desc');

    return routes.map(r => ({
      ...this.format(r),
      toWilaya: {
        name: r.to_wilaya_name,
        nameAr: r.to_wilaya_name_ar
      }
    }));
  }

  /**
   * Get routes to a specific wilaya
   * @param {number} toWilayaId - Destination wilaya code
   * @returns {Promise<Array>} Routes list
   */
  async getRoutesTo(toWilayaId) {
    const routes = await this.knex(this.tableName)
      .select('routes.*',
        'from_wilaya.name as from_wilaya_name',
        'from_wilaya.name_ar as from_wilaya_name_ar'
      )
      .join('wilayas as from_wilaya', 'routes.from_wilaya_id', 'from_wilaya.code')
      .where('routes.to_wilaya_id', toWilayaId)
      .orderBy('trip_count', 'desc');

    return routes.map(r => ({
      ...this.format(r),
      fromWilaya: {
        name: r.from_wilaya_name,
        nameAr: r.from_wilaya_name_ar
      }
    }));
  }

  /**
   * Increment trip count for route
   * @param {number} fromWilayaId - Origin wilaya code
   * @param {number} toWilayaId - Destination wilaya code
   * @returns {Promise<void>}
   */
  async incrementTripCount(fromWilayaId, toWilayaId) {
    await this.knex(this.tableName)
      .where({
        from_wilaya_id: fromWilayaId,
        to_wilaya_id: toWilayaId
      })
      .increment('trip_count', 1)
      .update({ updated_at: new Date() });
  }

  /**
   * Update route statistics
   * @param {number} fromWilayaId - Origin wilaya code
   * @param {number} toWilayaId - Destination wilaya code
   * @param {number} price - New price to include in average
   * @returns {Promise<void>}
   */
  async updateAveragePrice(fromWilayaId, toWilayaId, price) {
    const route = await this.findByEndpoints(fromWilayaId, toWilayaId);
    
    if (route) {
      // Calculate new average
      const newAverage = ((route.averagePrice * route.tripCount) + price) / (route.tripCount + 1);
      
      await this.knex(this.tableName)
        .where({
          from_wilaya_id: fromWilayaId,
          to_wilaya_id: toWilayaId
        })
        .update({
          average_price: Math.round(newAverage),
          updated_at: new Date()
        });
    }
  }

  /**
   * Search routes
   * @param {string} query - Search query
   * @returns {Promise<Array>} Search results
   */
  async search(query) {
    const routes = await this.knex(this.tableName)
      .select('routes.*',
        'from_wilaya.name as from_wilaya_name',
        'to_wilaya.name as to_wilaya_name'
      )
      .join('wilayas as from_wilaya', 'routes.from_wilaya_id', 'from_wilaya.code')
      .join('wilayas as to_wilaya', 'routes.to_wilaya_id', 'to_wilaya.code')
      .where(function() {
        this.where('from_wilaya.name', 'ilike', `%${query}%`)
          .orWhere('from_wilaya.name_ar', 'ilike', `%${query}%`)
          .orWhere('to_wilaya.name', 'ilike', `%${query}%`)
          .orWhere('to_wilaya.name_ar', 'ilike', `%${query}%`);
      })
      .orderBy('trip_count', 'desc')
      .limit(20);

    return routes.map(r => ({
      ...this.format(r),
      fromWilaya: { name: r.from_wilaya_name },
      toWilaya: { name: r.to_wilaya_name }
    }));
  }

  /**
   * Calculate average price based on distance
   * @param {number} distanceKm - Distance in km
   * @returns {number} Average price
   */
  calculateAveragePrice(distanceKm) {
    // Base fare + per km rate
    const baseFare = 50;
    const perKmRate = 15;
    return Math.round(baseFare + (distanceKm * perKmRate));
  }

  /**
   * Format route object
   * @param {Object} route - Raw route object
   * @returns {Object} Formatted route
   */
  format(route) {
    if (!route) return null;

    return {
      id: route.id,
      from: {
        wilayaId: route.from_wilaya_id,
        city: route.from_city
      },
      to: {
        wilayaId: route.to_wilaya_id,
        city: route.to_city
      },
      distance: {
        km: route.distance_km,
        durationMinutes: route.duration_minutes,
        formattedDuration: this.formatDuration(route.duration_minutes)
      },
      costs: {
        toll: route.toll_cost,
        fuelEstimate: route.fuel_cost_estimate
      },
      pricing: {
        average: route.average_price
      },
      geometry: route.route_geometry,
      waypoints: route.waypoints,
      isPopular: route.is_popular,
      tripCount: route.trip_count,
      createdAt: route.created_at,
      updatedAt: route.updated_at
    };
  }

  /**
   * Format duration in human readable format
   * @param {number} minutes - Duration in minutes
   * @returns {string} Formatted duration
   */
  formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} h`;
    return `${hours}h ${mins}m`;
  }

  /**
   * Get route statistics
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics() {
    const stats = await this.knex(this.tableName)
      .select(
        this.knex.raw('COUNT(*) as total_routes'),
        this.knex.raw("COUNT(*) FILTER (WHERE is_popular = true) as popular_routes"),
        this.knex.raw('SUM(trip_count) as total_trips'),
        this.knex.raw('AVG(distance_km) as average_distance'),
        this.knex.raw('AVG(average_price) as average_price')
      )
      .first();

    return stats;
  }
}

module.exports = RouteModel;
