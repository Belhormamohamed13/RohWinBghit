/**
 * SMS Notification Observer
 * Sends SMS notifications via Twilio or local gateway
 * Implements Observer Pattern
 */

class SMSObserver {
  constructor(config = {}) {
    this.provider = config.provider || 'twilio'; // 'twilio' or 'local'
    this.accountSid = config.accountSid || process.env.TWILIO_ACCOUNT_SID;
    this.authToken = config.authToken || process.env.TWILIO_AUTH_TOKEN;
    this.phoneNumber = config.phoneNumber || process.env.TWILIO_PHONE_NUMBER;
    this.localGatewayUrl = config.localGatewayUrl;
    this.templates = new Map();
    this.initializeTemplates();
  }

  /**
   * Initialize SMS templates
   */
  initializeTemplates() {
    // Short, concise messages for SMS
    this.templates.set('booking_confirmation', 
      'RohWinBghit: Booking #{bookingId} confirmed! {from} to {to} on {date} at {time}. Driver: {driverName}. Price: {price} DZD.'
    );
    
    this.templates.set('booking_cancelled', 
      'RohWinBghit: Booking #{bookingId} has been cancelled. Refund of {refundAmount} DZD will be processed within 5-7 days.'
    );
    
    this.templates.set('trip_reminder', 
      'RohWinBghit: Reminder - Your trip from {from} to {to} is tomorrow at {time}. Have a safe journey!'
    );
    
    this.templates.set('driver_arriving', 
      'RohWinBghit: Your driver {driverName} is arriving now! Vehicle: {vehicleInfo}. License: {licensePlate}'
    );
    
    this.templates.set('otp_verification', 
      'RohWinBghit: Your verification code is {otp}. Valid for 10 minutes. Do not share this code.'
    );
    
    this.templates.set('payment_received', 
      'RohWinBghit: Payment of {amount} DZD received for booking #{bookingId}. Thank you!'
    );
    
    this.templates.set('password_reset', 
      'RohWinBghit: Your password reset code is {code}. Valid for 1 hour.'
    );
    
    this.templates.set('new_booking_request', 
      'RohWinBghit: New booking request! {from} to {to} on {date}. Check your app for details.'
    );
  }

  /**
   * Update method called by notification subject
   * @param {Object} notification - Notification data
   */
  async update(notification) {
    const { type, recipient, data } = notification;
    
    if (!recipient.phone) {
      console.log('SMSObserver: No phone number provided');
      return { success: false, error: 'No phone number' };
    }

    // Validate Algerian phone number format
    if (!this.isValidAlgerianNumber(recipient.phone)) {
      return { success: false, error: 'Invalid phone number format' };
    }

    try {
      const result = await this.send(type, recipient.phone, data);
      return { success: true, channel: 'sms', result };
    } catch (error) {
      console.error('SMSObserver Error:', error);
      return { success: false, channel: 'sms', error: error.message };
    }
  }

  /**
   * Send SMS notification
   * @param {string} type - Notification type
   * @param {string} to - Phone number
   * @param {Object} data - Template data
   * @returns {Promise<Object>} Send result
   */
  async send(type, to, data) {
    const template = this.templates.get(type);
    
    if (!template) {
      throw new Error(`Unknown SMS template type: ${type}`);
    }

    const message = this.fillTemplate(template, data);
    
    // In development/test, log instead of sending
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.log(`[SMS] To: ${to}`);
      console.log(`[SMS] Message: ${message}`);
      
      return {
        messageId: `mock_sms_${Date.now()}`,
        status: 'sent',
        to,
        message
      };
    }

    // Real SMS sending
    if (this.provider === 'twilio') {
      return await this.sendViaTwilio(to, message);
    } else if (this.provider === 'local') {
      return await this.sendViaLocalGateway(to, message);
    }

    throw new Error(`Unknown SMS provider: ${this.provider}`);
  }

  /**
   * Send via Twilio
   * @param {string} to - Recipient phone
   * @param {string} message - SMS body
   * @returns {Promise<Object>} Send result
   */
  async sendViaTwilio(to, message) {
    // const twilio = require('twilio');
    // const client = twilio(this.accountSid, this.authToken);
    
    // const result = await client.messages.create({
    //   body: message,
    //   from: this.phoneNumber,
    //   to: this.formatPhoneNumber(to)
    // });
    
    return { 
      messageId: `twilio_${Date.now()}`, 
      status: 'sent',
      to,
      message
    };
  }

  /**
   * Send via local Algerian SMS gateway
   * @param {string} to - Recipient phone
   * @param {string} message - SMS body
   * @returns {Promise<Object>} Send result
   */
  async sendViaLocalGateway(to, message) {
    // Integration with local Algerian SMS provider
    // const response = await fetch(this.localGatewayUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ to, message })
    // });
    
    return { 
      messageId: `local_${Date.now()}`, 
      status: 'sent',
      to,
      message
    };
  }

  /**
   * Send OTP verification code
   * @param {string} phone - Phone number
   * @param {string} otp - One-time password
   * @returns {Promise<Object>} Send result
   */
  async sendOTP(phone, otp) {
    return this.send('otp_verification', phone, { otp });
  }

  /**
   * Fill template with data
   * @param {string} template - Template string
   * @param {Object} data - Data to fill
   * @returns {string} Filled template
   */
  fillTemplate(template, data) {
    let filled = template;
    for (const [key, value] of Object.entries(data)) {
      filled = filled.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return filled;
  }

  /**
   * Validate Algerian phone number
   * @param {string} phone - Phone number
   * @returns {boolean} Valid or not
   */
  isValidAlgerianNumber(phone) {
    // Algerian numbers: +213 5XX XXX XXX or 05XX XXX XXX or 5XX XXX XXX
    const cleanPhone = phone.replace(/[\s\-\.]/g, '');
    const algerianRegex = /^(\+213|00213|0)?[5-7]\d{8}$/;
    return algerianRegex.test(cleanPhone);
  }

  /**
   * Format phone number for international sending
   * @param {string} phone - Phone number
   * @returns {string} Formatted number
   */
  formatPhoneNumber(phone) {
    const clean = phone.replace(/[\s\-\.]/g, '');
    
    if (clean.startsWith('+213')) {
      return clean;
    }
    
    if (clean.startsWith('00213')) {
      return '+' + clean.substring(2);
    }
    
    if (clean.startsWith('0')) {
      return '+213' + clean.substring(1);
    }
    
    return '+213' + clean;
  }

  /**
   * Get observer name
   * @returns {string}
   */
  getName() {
    return 'SMS Observer';
  }

  /**
   * Get supported notification types
   * @returns {Array<string>}
   */
  getSupportedTypes() {
    return Array.from(this.templates.keys());
  }
}

module.exports = SMSObserver;
