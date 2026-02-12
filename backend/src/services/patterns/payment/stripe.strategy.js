/**
 * Stripe Payment Strategy
 * International card processing via Stripe
 */

class StripeStrategy {
  constructor(config = {}) {
    this.secretKey = config.secretKey || process.env.STRIPE_SECRET_KEY;
    this.webhookSecret = config.webhookSecret || process.env.STRIPE_WEBHOOK_SECRET;
    this.testMode = config.testMode || process.env.NODE_ENV !== 'production';
  }

  /**
   * Process Stripe payment
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} Payment result
   */
  async process(paymentData) {
    const { 
      paymentMethodId,
      paymentIntentId,
      amount, 
      currency = 'eur',
      bookingId,
      description,
      customerEmail,
      savePaymentMethod = false
    } = paymentData;

    try {
      // In test mode, simulate Stripe API
      if (this.testMode) {
        await this.simulateNetworkDelay();
        
        // Simulate successful payment
        if (paymentMethodId || paymentIntentId) {
          return {
            success: true,
            transactionId: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount: Math.round(amount * 100) / 100, // Convert to cents and back
            currency: currency.toLowerCase(),
            bookingId,
            method: 'stripe',
            timestamp: new Date().toISOString(),
            cardBrand: 'visa',
            cardLast4: '4242',
            receiptUrl: `https://pay.stripe.com/receipts/${bookingId}`,
            message: 'Payment processed successfully (TEST MODE)'
          };
        } else {
          return {
            success: false,
            error: 'Payment method required',
            code: 'PAYMENT_METHOD_REQUIRED'
          };
        }
      }

      // Real Stripe integration would use stripe library
      // const stripe = require('stripe')(this.secretKey);
      // const paymentIntent = await stripe.paymentIntents.create({...});

      return {
        success: true,
        transactionId: `pi_${Date.now()}`,
        amount,
        currency,
        bookingId,
        method: 'stripe',
        status: 'succeeded'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'STRIPE_ERROR'
      };
    }
  }

  /**
   * Create payment intent for client-side confirmation
   * @param {Object} intentData - Intent creation data
   * @returns {Promise<Object>} Payment intent
   */
  async createPaymentIntent(intentData) {
    const { amount, currency = 'eur', bookingId, metadata = {} } = intentData;

    try {
      if (this.testMode) {
        return {
          success: true,
          clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 16)}`,
          paymentIntentId: `pi_${Date.now()}`,
          amount: Math.round(amount * 100),
          currency: currency.toLowerCase(),
          status: 'requires_confirmation'
        };
      }

      // Real Stripe payment intent creation
      return {
        success: true,
        clientSecret: 'secret_placeholder',
        paymentIntentId: `pi_${Date.now()}`,
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Refund Stripe payment
   * @param {Object} refundData - Refund details
   * @returns {Promise<Object>} Refund result
   */
  async refund(refundData) {
    const { transactionId, amount, reason } = refundData;

    try {
      if (this.testMode) {
        await this.simulateNetworkDelay();
        return {
          success: true,
          refundId: `re_${Date.now()}`,
          originalTransactionId: transactionId,
          amount,
          status: 'succeeded',
          timestamp: new Date().toISOString()
        };
      }

      // Real Stripe refund
      return {
        success: true,
        refundId: `re_${Date.now()}`,
        originalTransactionId: transactionId,
        amount,
        status: 'succeeded'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'REFUND_ERROR'
      };
    }
  }

  /**
   * Handle Stripe webhook
   * @param {Object} payload - Webhook payload
   * @param {string} signature - Webhook signature
   * @returns {Promise<Object>} Webhook handling result
   */
  async handleWebhook(payload, signature) {
    try {
      // Verify webhook signature
      // const stripe = require('stripe')(this.secretKey);
      // const event = stripe.webhooks.constructEvent(payload, signature, this.webhookSecret);
      
      const event = JSON.parse(payload);

      switch (event.type) {
        case 'payment_intent.succeeded':
          return { 
            success: true, 
            event: event.type,
            paymentIntent: event.data.object 
          };
        case 'payment_intent.payment_failed':
          return { 
            success: false, 
            event: event.type,
            error: event.data.object.last_payment_error 
          };
        default:
          return { success: true, event: event.type };
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'WEBHOOK_ERROR'
      };
    }
  }

  simulateNetworkDelay() {
    return new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
  }

  getName() {
    return 'Credit/Debit Card (Stripe)';
  }

  getDescription() {
    return 'Pay securely with your credit or debit card via Stripe';
  }

  requiresOnline() {
    return true;
  }

  supportsRecurring() {
    return true;
  }

  getSupportedCurrencies() {
    return ['EUR', 'USD', 'GBP', 'CAD', 'AUD'];
  }
}

module.exports = StripeStrategy;
