/**
 * Standard Pricing Strategy
 * Fixed pricing based on distance with optional base fare
 * Implements Strategy Pattern for pricing
 */

class StandardPricingStrategy {
  constructor(config = {}) {
    this.baseFare = config.baseFare || 50; // DZD
    this.pricePerKm = config.pricePerKm || 15; // DZD per km
    this.minimumFare = config.minimumFare || 100; // DZD
  }

  /**
   * Calculate trip price using standard formula
   * @param {Object} params - Pricing parameters
   * @param {number} params.distance - Distance in kilometers
   * @param {number} params.passengers - Number of passengers
   * @param {string} params.vehicleType - Type of vehicle
   * @returns {Object} Price breakdown
   */
  calculatePrice(params) {
    const { distance, passengers = 1, vehicleType = 'standard' } = params;
    
    // Calculate base distance price
    let distancePrice = this.baseFare + (distance * this.pricePerKm);
    
    // Apply vehicle type multiplier
    const vehicleMultiplier = this.getVehicleMultiplier(vehicleType);
    distancePrice *= vehicleMultiplier;
    
    // Apply passenger surcharge (small fee per additional passenger)
    const passengerSurcharge = (passengers - 1) * 20; // 20 DZD per extra passenger
    
    // Calculate subtotal
    let subtotal = distancePrice + passengerSurcharge;
    
    // Apply minimum fare
    subtotal = Math.max(subtotal, this.minimumFare);
    
    // Calculate platform fee (10%)
    const platformFee = subtotal * 0.10;
    
    // Calculate total
    const total = subtotal + platformFee;
    
    return {
      strategy: 'standard',
      baseFare: this.baseFare,
      distancePrice: Math.round(distancePrice),
      passengerSurcharge: passengers > 1 ? passengerSurcharge : 0,
      vehicleMultiplier,
      platformFee: Math.round(platformFee),
      subtotal: Math.round(subtotal),
      total: Math.round(total),
      currency: 'DZD',
      breakdown: {
        distance,
        pricePerKm: this.pricePerKm,
        passengers,
        vehicleType
      }
    };
  }

  /**
   * Get price multiplier based on vehicle type
   * @param {string} vehicleType - Vehicle classification
   * @returns {number} Multiplier value
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
   * Get strategy name
   * @returns {string}
   */
  getName() {
    return 'Standard Pricing';
  }

  /**
   * Get strategy description
   * @returns {string}
   */
  getDescription() {
    return 'Fixed pricing based on distance with transparent fare calculation';
  }
}

module.exports = StandardPricingStrategy;
