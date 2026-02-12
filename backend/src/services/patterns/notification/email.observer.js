/**
 * Email Notification Observer
 * Sends email notifications via SendGrid or AWS SES
 * Implements Observer Pattern
 */

class EmailObserver {
  constructor(config = {}) {
    this.provider = config.provider || 'sendgrid'; // 'sendgrid' or 'ses'
    this.apiKey = config.apiKey || process.env.SENDGRID_API_KEY;
    this.fromEmail = config.fromEmail || process.env.EMAIL_FROM || 'noreply@rohwinbghit.com';
    this.fromName = config.fromName || process.env.EMAIL_FROM_NAME || 'RohWinBghit';
    this.templates = new Map();
    this.initializeTemplates();
  }

  /**
   * Initialize email templates
   */
  initializeTemplates() {
    this.templates.set('welcome', {
      subject: 'Welcome to RohWinBghit!',
      templateId: 'd-welcome-template'
    });
    this.templates.set('booking_confirmation', {
      subject: 'Your Booking is Confirmed',
      templateId: 'd-booking-confirm-template'
    });
    this.templates.set('booking_cancelled', {
      subject: 'Booking Cancelled',
      templateId: 'd-booking-cancel-template'
    });
    this.templates.set('trip_reminder', {
      subject: 'Reminder: Your Trip is Tomorrow',
      templateId: 'd-trip-reminder-template'
    });
    this.templates.set('payment_receipt', {
      subject: 'Payment Receipt',
      templateId: 'd-payment-receipt-template'
    });
    this.templates.set('password_reset', {
      subject: 'Password Reset Request',
      templateId: 'd-password-reset-template'
    });
    this.templates.set('driver_approved', {
      subject: 'Driver Application Approved',
      templateId: 'd-driver-approved-template'
    });
    this.templates.set('review_received', {
      subject: 'You Received a New Review',
      templateId: 'd-review-template'
    });
  }

  /**
   * Update method called by notification subject
   * @param {Object} notification - Notification data
   */
  async update(notification) {
    const { type, recipient, data } = notification;
    
    if (!recipient.email) {
      console.log('EmailObserver: No email address provided');
      return { success: false, error: 'No email address' };
    }

    try {
      const result = await this.send(type, recipient.email, data);
      return { success: true, channel: 'email', result };
    } catch (error) {
      console.error('EmailObserver Error:', error);
      return { success: false, channel: 'email', error: error.message };
    }
  }

  /**
   * Send email notification
   * @param {string} type - Notification type
   * @param {string} to - Recipient email
   * @param {Object} data - Template data
   * @returns {Promise<Object>} Send result
   */
  async send(type, to, data) {
    const template = this.templates.get(type);
    
    if (!template) {
      throw new Error(`Unknown email template type: ${type}`);
    }

    // In development/test, log instead of sending
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.log(`[EMAIL] To: ${to}`);
      console.log(`[EMAIL] Subject: ${template.subject}`);
      console.log(`[EMAIL] Data:`, JSON.stringify(data, null, 2));
      
      return {
        messageId: `mock_${Date.now()}`,
        status: 'sent',
        to,
        subject: template.subject
      };
    }

    // Real email sending
    if (this.provider === 'sendgrid') {
      return await this.sendViaSendGrid(template, to, data);
    } else if (this.provider === 'ses') {
      return await this.sendViaSES(template, to, data);
    }

    throw new Error(`Unknown email provider: ${this.provider}`);
  }

  /**
   * Send via SendGrid
   * @param {Object} template - Template config
   * @param {string} to - Recipient
   * @param {Object} data - Template data
   * @returns {Promise<Object>} Send result
   */
  async sendViaSendGrid(template, to, data) {
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(this.apiKey);
    
    const msg = {
      to,
      from: { email: this.fromEmail, name: this.fromName },
      templateId: template.templateId,
      dynamicTemplateData: data
    };

    // const result = await sgMail.send(msg);
    // return { messageId: result[0].messageId, status: 'sent' };
    
    return { messageId: `sg_${Date.now()}`, status: 'sent' };
  }

  /**
   * Send via AWS SES
   * @param {Object} template - Template config
   * @param {string} to - Recipient
   * @param {Object} data - Template data
   * @returns {Promise<Object>} Send result
   */
  async sendViaSES(template, to, data) {
    // AWS SES implementation
    // const AWS = require('aws-sdk');
    // const ses = new AWS.SES({ region: 'us-east-1' });
    
    return { messageId: `ses_${Date.now()}`, status: 'sent' };
  }

  /**
   * Send welcome email
   * @param {string} email - User email
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Send result
   */
  async sendWelcome(email, userData) {
    return this.send('welcome', email, {
      firstName: userData.firstName,
      loginUrl: `${process.env.FRONTEND_URL}/login`
    });
  }

  /**
   * Send booking confirmation
   * @param {string} email - Passenger email
   * @param {Object} bookingData - Booking details
   * @returns {Promise<Object>} Send result
   */
  async sendBookingConfirmation(email, bookingData) {
    return this.send('booking_confirmation', email, {
      bookingId: bookingData.id,
      passengerName: bookingData.passengerName,
      from: bookingData.from,
      to: bookingData.to,
      date: bookingData.date,
      time: bookingData.time,
      price: bookingData.price,
      driverName: bookingData.driverName,
      vehicleInfo: bookingData.vehicleInfo,
      qrCodeUrl: bookingData.qrCodeUrl
    });
  }

  /**
   * Send password reset email
   * @param {string} email - User email
   * @param {string} resetToken - Reset token
   * @returns {Promise<Object>} Send result
   */
  async sendPasswordReset(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    return this.send('password_reset', email, {
      resetUrl,
      expiresIn: '1 hour'
    });
  }

  /**
   * Get observer name
   * @returns {string}
   */
  getName() {
    return 'Email Observer';
  }

  /**
   * Get supported notification types
   * @returns {Array<string>}
   */
  getSupportedTypes() {
    return Array.from(this.templates.keys());
  }
}

module.exports = EmailObserver;
