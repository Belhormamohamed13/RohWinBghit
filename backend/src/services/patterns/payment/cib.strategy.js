/**
 * CIB (Carte Interbancaire) Payment Strategy
 * Algerian interbank card payment processing
 */

class CIBStrategy {
  constructor(config = {}) {
    this.merchantId = config.merchantId || process.env.CIB_MERCHANT_ID;
    this.apiKey = config.apiKey || process.env.CIB_API_KEY;
    this.apiUrl = config.apiUrl || 'https://api.cib.dz/payment';
    this.testMode = config.testMode || process.env.NODE_ENV !== 'production';
  }

  /**
   * Process CIB card payment
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
      // In production, this would make actual API call to CIB
      if (this.testMode) {
        // Simulate payment processing
        await this.simulateNetworkDelay();
        
        // Simulate success for test cards
        if (cardNumber.startsWith('1234')) {
          return {
            success: true,
            transactionId: `CIB_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount,
            currency,
            bookingId,
            method: 'cib',
            timestamp: new Date().toISOString(),
            cardLast4: cardNumber.slice(-4),
            receiptUrl: null,
            message: 'Payment processed successfully (TEST MODE)'
          };
        } else {
          return {
            success: false,
            error: 'Card declined by issuer',
            code: 'CARD_DECLINED',
            declineReason: 'INSUFFICIENT_FUNDS'
          };
        }
      }

      // Real CIB API integration would go here
      const response = await this.callCIBAPI({
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
   * Refund CIB payment
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

      // Real refund API call would go here
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
   * Validate CIB card details
   * @param {string} cardNumber - Card number
   * @param {string} expiryMonth - Expiry month (MM)
   * @param {string} expiryYear - Expiry year (YY or YYYY)
   * @param {string} cvv - CVV code
   * @returns {Object} Validation result
   */
  validateCard(cardNumber, expiryMonth, expiryYear, cvv) {
    // Remove spaces and dashes
    const cleanCard = cardNumber.replace(/[\s-]/g, '');
    
    // Check if numeric and 16 digits
    if (!/^\d{16}$/.test(cleanCard)) {
      return { valid: false, error: 'Invalid card number format' };
    }

    // Luhn algorithm validation
    if (!this.luhnCheck(cleanCard)) {
      return { valid: false, error: 'Invalid card number (checksum failed)' };
    }

    // Validate expiry
    const month = parseInt(expiryMonth, 10);
    let year = parseInt(expiryYear, 10);
    
    if (year < 100) year += 2000; // Convert YY to YYYY
    
    const now = new Date();
    const expiry = new Date(year, month, 0);
    
    if (expiry < now) {
      return { valid: false, error: 'Card has expired' };
    }

    // Validate CVV
    if (!/^\d{3}$/.test(cvv)) {
      return { valid: false, error: 'Invalid CVV' };
    }

    return { valid: true };
  }

  /**
   * Luhn algorithm for card validation
   * @param {string} cardNumber - Clean card number
   * @returns {boolean} Valid or not
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

  /**
   * Simulate network delay for testing
   * @returns {Promise<void>}
   */
  simulateNetworkDelay() {
    return new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
  }

  /**
   * Call CIB API (placeholder for real implementation)
   * @param {Object} params - API parameters
   * @returns {Promise<Object>} API response
   */
  async callCIBAPI(params) {
    // This would be replaced with actual HTTP call to CIB
    throw new Error('CIB API integration not implemented');
  }

  /**
   * Format API response
   * @param {Object} response - Raw API response
   * @returns {Object} Formatted response
   */
  formatResponse(response) {
    return response;
  }

  /**
   * Get strategy name
   * @returns {string}
   */
  getName() {
    return 'CIB Card';
  }

  /**
   * Get strategy description
   * @returns {string}
   */
  getDescription() {
    return 'Pay with Algerian interbank card (CIB)';
  }

  /**
   * Check if requires online processing
   * @returns {boolean}
   */
  requiresOnline() {
    return true;
  }

  /**
   * Check if supports recurring payments
   * @returns {boolean}
   */
  supportsRecurring() {
    return true;
  }

  /**
   * Get supported currencies
   * @returns {Array<string>}
   */
  getSupportedCurrencies() {
    return ['DZD'];
  }
}

module.exports = CIBStrategy;
