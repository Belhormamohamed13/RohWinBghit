/**
 * Payment Strategy Factory
 * Creates appropriate payment strategy based on payment method
 * Implements Factory Pattern
 */

const CIBStrategy = require('./cib.strategy');
const EdahabiaStrategy = require('./edahabia.strategy');
const CashStrategy = require('./cash.strategy');
const StripeStrategy = require('./stripe.strategy');
const PayPalStrategy = require('./paypal.strategy');

class PaymentFactory {
  constructor(config = {}) {
    this.config = config;
    this.strategies = new Map();
    
    // Initialize all strategies
    this.registerStrategy('cib', new CIBStrategy(config.cib));
    this.registerStrategy('edahabia', new EdahabiaStrategy(config.edahabia));
    this.registerStrategy('cash', new CashStrategy(config.cash));
    this.registerStrategy('stripe', new StripeStrategy(config.stripe));
    this.registerStrategy('paypal', new PayPalStrategy(config.paypal));
  }

  /**
   * Register a payment strategy
   * @param {string} method - Payment method identifier
   * @param {Object} strategy - Strategy instance
   */
  registerStrategy(method, strategy) {
    this.strategies.set(method.toLowerCase(), strategy);
  }

  /**
   * Get payment strategy for given method
   * @param {string} method - Payment method
   * @returns {Object} Payment strategy instance
   */
  getStrategy(method) {
    const strategy = this.strategies.get(method.toLowerCase());
    if (!strategy) {
      throw new Error(`Payment method not supported: ${method}`);
    }
    return strategy;
  }

  /**
   * Process payment using appropriate strategy
   * @param {string} method - Payment method
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} Payment result
   */
  async processPayment(method, paymentData) {
    const strategy = this.getStrategy(method);
    return await strategy.process(paymentData);
  }

  /**
   * Refund payment using appropriate strategy
   * @param {string} method - Payment method
   * @param {Object} refundData - Refund details
   * @returns {Promise<Object>} Refund result
   */
  async refundPayment(method, refundData) {
    const strategy = this.getStrategy(method);
    return await strategy.refund(refundData);
  }

  /**
   * Get all available payment methods
   * @returns {Array} List of available methods
   */
  getAvailableMethods() {
    const methods = [];
    for (const [key, strategy] of this.strategies) {
      methods.push({
        id: key,
        name: strategy.getName(),
        description: strategy.getDescription(),
        requiresOnline: strategy.requiresOnline(),
        supportsRecurring: strategy.supportsRecurring(),
        supportedCurrencies: strategy.getSupportedCurrencies()
      });
    }
    return methods;
  }

  /**
   * Check if payment method is available
   * @param {string} method - Payment method
   * @returns {boolean}
   */
  isMethodAvailable(method) {
    return this.strategies.has(method.toLowerCase());
  }
}

module.exports = PaymentFactory;
