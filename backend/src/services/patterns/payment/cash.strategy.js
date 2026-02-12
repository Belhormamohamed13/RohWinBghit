/**
 * Cash Payment Strategy
 * Pay driver directly in cash
 */

class CashStrategy {
  constructor(config = {}) {
    this.requiresConfirmation = config.requiresConfirmation !== false;
    this.confirmationTimeout = config.confirmationTimeout || 30; // minutes
  }

  /**
   * Process cash payment (creates pending payment record)
   * @param {Object} paymentData - Payment details
   * @returns {Promise<Object>} Payment result
   */
  async process(paymentData) {
    const { 
      amount, 
      currency = 'DZD',
      bookingId,
      passengerName,
      driverName,
      pickupLocation,
      dropoffLocation
    } = paymentData;

    // Cash payments don't process online
    // They create a pending record that gets confirmed after trip completion
    return {
      success: true,
      transactionId: `CASH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount,
      currency,
      bookingId,
      method: 'cash',
      status: 'pending_cash_payment',
      timestamp: new Date().toISOString(),
      message: 'Please pay the driver in cash at the end of your trip',
      instructions: {
        passenger: `Please prepare exact change: ${amount} ${currency}`,
        driver: `Collect ${amount} ${currency} from passenger upon arrival`,
        confirmationRequired: this.requiresConfirmation
      },
      receiptUrl: null
    };
  }

  /**
   * Confirm cash payment received (called by driver)
   * @param {Object} confirmationData - Confirmation details
   * @returns {Promise<Object>} Confirmation result
   */
  async confirmPayment(confirmationData) {
    const { transactionId, bookingId, driverId, amountReceived } = confirmationData;

    return {
      success: true,
      transactionId,
      bookingId,
      status: 'completed',
      amountReceived,
      confirmedAt: new Date().toISOString(),
      confirmedBy: driverId,
      message: 'Cash payment confirmed by driver'
    };
  }

  /**
   * Refund cash payment (not applicable for cash)
   * @param {Object} refundData - Refund details
   * @returns {Promise<Object>} Refund result
   */
  async refund(refundData) {
    // For cash payments, refunds are handled manually
    return {
      success: true,
      refundId: `CASH_REF_${Date.now()}`,
      originalTransactionId: refundData.transactionId,
      amount: refundData.amount,
      status: 'manual_refund_required',
      message: 'Cash refunds must be processed manually by the driver',
      instructions: 'Please contact the driver to arrange refund'
    };
  }

  getName() {
    return 'Cash Payment';
  }

  getDescription() {
    return 'Pay the driver directly in cash at the end of your trip';
  }

  requiresOnline() {
    return false;
  }

  supportsRecurring() {
    return false;
  }

  getSupportedCurrencies() {
    return ['DZD', 'EUR', 'USD'];
  }
}

module.exports = CashStrategy;
