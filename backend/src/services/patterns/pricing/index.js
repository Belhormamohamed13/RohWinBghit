/**
 * Pricing Strategies Index
 * Factory for creating pricing strategy instances
 */

const StandardPricingStrategy = require('./standard.pricing');
const DynamicPricingStrategy = require('./dynamic.pricing');

class PricingStrategyFactory {
  static createStrategy(type, config = {}) {
    switch (type) {
      case 'standard':
        return new StandardPricingStrategy(config);
      case 'dynamic':
        return new DynamicPricingStrategy(config);
      default:
        throw new Error(`Unknown pricing strategy: ${type}`);
    }
  }

  static getAvailableStrategies() {
    return [
      {
        type: 'standard',
        name: 'Standard Pricing',
        description: 'Fixed pricing based on distance'
      },
      {
        type: 'dynamic',
        name: 'Dynamic Pricing',
        description: 'AI-powered surge pricing based on demand'
      }
    ];
  }
}

module.exports = {
  PricingStrategyFactory,
  StandardPricingStrategy,
  DynamicPricingStrategy
};
