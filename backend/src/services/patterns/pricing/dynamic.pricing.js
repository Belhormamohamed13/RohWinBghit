/**
 * Dynamic Pricing Strategy
 * AI-powered surge pricing based on demand/supply ratio
 * Implements Strategy Pattern for pricing
 */

class DynamicPricingStrategy {
  constructor(config = {}) {
    this.baseFare = config.baseFare || 50;
    this.pricePerKm = config.pricePerKm || 15;
    this.minimumFare = config.minimumFare || 100;
    this.maxSurgeMultiplier = config.maxSurgeMultiplier || 2.5;
    this.demandThreshold = config.demandThreshold || 1.5;
  }

  /**
   * Calculate dynamic price with surge pricing
   * @param {Object} params - Pricing parameters
   * @param {number} params.distance - Distance in km
   * @param {number} params.passengers - Number of passengers
   * @param {string} params.vehicleType - Vehicle type
   * @param {Object} params.marketConditions - Real-time market data
   * @returns {Object} Price breakdown with surge info
   */
  calculatePrice(params) {
    const { 
      distance, 
      passengers = 1, 
      vehicleType = 'standard',
      marketConditions = {}
    } = params;

    // Calculate base price using standard formula
    let basePrice = this.baseFare + (distance * this.pricePerKm);
    
    // Apply vehicle multiplier
    const vehicleMultiplier = this.getVehicleMultiplier(vehicleType);
    basePrice *= vehicleMultiplier;
    
    // Calculate surge multiplier based on market conditions
    const surgeMultiplier = this.calculateSurgeMultiplier(marketConditions);
    
    // Apply surge to base price
    const surgePrice = basePrice * (surgeMultiplier - 1);
    const priceAfterSurge = basePrice * surgeMultiplier;
    
    // Passenger surcharge
    const passengerSurcharge = (passengers - 1) * 20;
    
    // Subtotal before platform fee
    let subtotal = priceAfterSurge + passengerSurcharge;
    subtotal = Math.max(subtotal, this.minimumFare);
    
    // Platform fee (10%)
    const platformFee = subtotal * 0.10;
    
    // Final total
    const total = subtotal + platformFee;
    
    return {
      strategy: 'dynamic',
      baseFare: this.baseFare,
      basePrice: Math.round(basePrice),
      surgeMultiplier: Math.round(surgeMultiplier * 100) / 100,
      surgePrice: Math.round(surgePrice),
      passengerSurcharge: passengers > 1 ? passengerSurcharge : 0,
      vehicleMultiplier,
      platformFee: Math.round(platformFee),
      subtotal: Math.round(subtotal),
      total: Math.round(total),
      currency: 'DZD',
      isSurgeActive: surgeMultiplier > 1,
      surgeReason: this.getSurgeReason(marketConditions),
      breakdown: {
        distance,
        pricePerKm: this.pricePerKm,
        passengers,
        vehicleType,
        demandRatio: marketConditions.demandRatio || 1,
        availableDrivers: marketConditions.availableDrivers || 0,
        activeBookings: marketConditions.activeBookings || 0
      }
    };
  }

  /**
   * Calculate surge multiplier based on market conditions
   * @param {Object} conditions - Market conditions
   * @returns {number} Surge multiplier (1.0 = no surge)
   */
  calculateSurgeMultiplier(conditions) {
    const {
      demandRatio = 1,           // Bookings / Available drivers
      timeOfDay = new Date().getHours(),
      isWeekend = [0, 6].includes(new Date().getDay()),
      isHoliday = false,
      weatherCondition = 'clear',
      routePopularity = 1        // 1 = normal, >1 = popular
    } = conditions;

    let multiplier = 1.0;

    // Demand-based surge
    if (demandRatio > this.demandThreshold) {
      const demandSurge = Math.min(
        (demandRatio - 1) * 0.5,
        this.maxSurgeMultiplier - 1
      );
      multiplier += demandSurge;
    }

    // Time-based surge (rush hours)
    const rushHourMultiplier = this.getRushHourMultiplier(timeOfDay, isWeekend);
    multiplier += rushHourMultiplier;

    // Holiday surge
    if (isHoliday) {
      multiplier += 0.3;
    }

    // Weather surge
    const weatherMultiplier = this.getWeatherMultiplier(weatherCondition);
    multiplier += weatherMultiplier;

    // Route popularity
    if (routePopularity > 1.5) {
      multiplier += 0.2;
    }

    // Cap at maximum
    return Math.min(multiplier, this.maxSurgeMultiplier);
  }

  /**
   * Get rush hour multiplier
   * @param {number} hour - Current hour (0-23)
   * @param {boolean} isWeekend - Is weekend
   * @returns {number} Multiplier addition
   */
  getRushHourMultiplier(hour, isWeekend) {
    if (isWeekend) return 0;

    // Morning rush: 7-9 AM
    if (hour >= 7 && hour <= 9) return 0.4;
    
    // Lunch rush: 12-2 PM
    if (hour >= 12 && hour <= 14) return 0.2;
    
    // Evening rush: 5-8 PM
    if (hour >= 17 && hour <= 20) return 0.5;
    
    // Late night: 11 PM - 5 AM
    if (hour >= 23 || hour <= 5) return 0.3;

    return 0;
  }

  /**
   * Get weather-based multiplier
   * @param {string} condition - Weather condition
   * @returns {number} Multiplier addition
   */
  getWeatherMultiplier(condition) {
    const weatherMultipliers = {
      'clear': 0,
      'cloudy': 0,
      'rain': 0.2,
      'heavy-rain': 0.4,
      'snow': 0.5,
      'fog': 0.3,
      'storm': 0.6
    };
    return weatherMultipliers[condition] || 0;
  }

  /**
   * Get vehicle type multiplier
   * @param {string} vehicleType - Vehicle type
   * @returns {number} Multiplier
   */
  getVehicleMultiplier(vehicleType) {
    const multipliers = {
      'economy': 0.9,
      'standard': 1.0,
      'comfort': 1.2,
      'premium': 1.5,
      'luxury': 2.0,
      'suv': 1.3,
      'van': 1.4,
      'bus': 1.8
    };
    return multipliers[vehicleType] || 1.0;
  }

  /**
   * Get human-readable surge reason
   * @param {Object} conditions - Market conditions
   * @returns {string|null}
   */
  getSurgeReason(conditions) {
    if (!conditions || Object.keys(conditions).length === 0) {
      return null;
    }

    const reasons = [];

    if (conditions.demandRatio > this.demandThreshold) {
      reasons.push('High demand');
    }

    const hour = conditions.timeOfDay || new Date().getHours();
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 20)) {
      reasons.push('Peak hours');
    }

    if (conditions.isHoliday) {
      reasons.push('Holiday');
    }

    if (conditions.weatherCondition && conditions.weatherCondition !== 'clear') {
      reasons.push('Weather conditions');
    }

    return reasons.length > 0 ? reasons.join(', ') : null;
  }

  /**
   * Get strategy name
   * @returns {string}
   */
  getName() {
    return 'Dynamic Pricing';
  }

  /**
   * Get strategy description
   * @returns {string}
   */
  getDescription() {
    return 'AI-powered pricing that adjusts based on demand, time, and market conditions';
  }
}

module.exports = DynamicPricingStrategy;
