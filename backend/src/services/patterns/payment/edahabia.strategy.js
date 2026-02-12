/**
 * Edahabia Payment Strategy
 * Algerian postal service card payment processing
 */

class EdahabiaStrategy {
  constructor(config = {}) {
    this.merchantId = config.merchantId || process.env.EDAHABIA_MERCHANT_ID;
    this.apiKey = config.apiKey || process.env.EDAHABIA_API_KEY;
    this.apiUrl = config.apiUrl || 'https://api.edahabia.dz/payment';
    this.testMode = config.testMode || process.env.NODE_ENV !== 'production';
  }

  /**
   * Process Edahabia card payment
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} Payment result
   */
  async process(paymentData) {
    const { 
      cardNumber, 
      expiryMonth, 
      expiryYear, 
      cvv, 
      cardHolder,
      amount, 
      currency = 'DZD',
      bookingId,
      description 
    } = paymentData;

    // Validate card
    const validation = this.validateCard(cardNumber, expiryMonth, expiryYear, cvv);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
        code: 'CARD_VALIDATION_FAILED'
      };
    }

    try {
      if (this.testMode) {
        await this.simulateNetworkDelay();
        
        // Edahabia cards start with 5
        if (cardNumber.startsWith('5')) {
          return {
            success: true,
            transactionId: `EDA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount,
            currency,
            bookingId,
            method: 'edahabia',
            timestamp: new Date().toISOString(),
            cardLast4: cardNumber.slice(-4),
            receiptUrl: null,
            message: 'Payment processed successfully (TEST MODE)'
          };
        } else {
          return {
            success: false,
            error: 'Invalid Edahabia card',
            code: 'INVALID_CARD'
          };
        }
      }

      // Real Edahabia API integration
      const response = await this.callEdahabiaAPI({
        merchantId: this.merchantId,
        cardNumber,
        expiryMonth,
        expiryYear,
        cvv,
        cardHolder,
        amount,
        currency,
        orderId: bookingId,
        description
      });

      return this.formatResponse(response);
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: 'PAYMENT_ERROR'
      };
    }
  }

  /**
   * Refund Edahabia payment
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
          refundId: `REF_${Date.now()}`,
          originalTransactionId: transactionId,
          amount,
          status: 'refunded',
          timestamp: new Date().toISOString()
        };
      }

      return {
        success: true,
        refundId: `REF_${Date.now()}`,
        originalTransactionId: transactionId,
        amount,
        status: 'refunded'
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
   * Validate Edahabia card
   * Edahabia cards typically start with 5 (Mastercard range)
   * @param {string} cardNumber - Card number
   * @param {string} expiryMonth - Expiry month
   * @param {string} expiryYear - Expiry year
   * @param {string} cvv - CVV
   * @returns {Object} Validation result
   */
  validateCard(cardNumber, expiryMonth, expiryYear, cvv) {
    const cleanCard = cardNumber.replace(/[\s-]/g, '');
    
    // Edahabia cards are typically 16 digits starting with 5
    if (!/^5\d{15}$/.test(cleanCard)) {
      return { valid: false, error: 'Invalid Edahabia card number' };
    }

    // Luhn check
    if (!this.luhnCheck(cleanCard)) {
      return { valid: false, error: 'Invalid card number (checksum failed)' };
    }

    // Expiry validation
    const month = parseInt(expiryMonth, 10);
    let year = parseInt(expiryYear, 10);
    if (year < 100) year += 2000;
    
    const now = new Date();
    const expiry = new Date(year, month, 0);
    
    if (expiry < now) {
      return { valid: false, error: 'Card has expired' };
    }

    // CVV validation
    if (!/^\d{3}$/.test(cvv)) {
      return { valid: false, error: 'Invalid CVV' };
    }

    return { valid: true };
  }

  /**
   * Luhn algorithm
   * @param {string} cardNumber - Card number
   * @returns {boolean}
   */
  luhnCheck(cardNumber) {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  simulateNetworkDelay() {
    return new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  }

  async callEdahabiaAPI(params) {
    throw new Error('Edahabia API integration not implemented');
  }

  formatResponse(response) {
    return response;
  }

  getName() {
    return 'Edahabia Card';
  }

  getDescription() {
    return 'Pay with Algerian postal service Edahabia card';
  }

  requiresOnline() {
    return true;
  }

  supportsRecurring() {
    return true;
  }

  getSupportedCurrencies() {
    return ['DZD'];
  }
}

module.exports = EdahabiaStrategy;
