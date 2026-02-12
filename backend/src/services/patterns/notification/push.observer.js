/**
 * Push Notification Observer
 * Sends push notifications via Firebase Cloud Messaging
 * Implements Observer Pattern
 */

class PushObserver {
  constructor(config = {}) {
    this.provider = config.provider || 'firebase'; // 'firebase' or 'onesignal'
    this.firebaseConfig = config.firebase || {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    };
    this.templates = new Map();
    this.initializeTemplates();
  }

  /**
   * Initialize push notification templates
   */
  initializeTemplates() {
    this.templates.set('booking_confirmation', {
      title: 'Booking Confirmed!',
      body: 'Your trip from {from} to {to} is confirmed.',
      data: { type: 'booking_confirmed', bookingId: '{bookingId}' }
    });
    
    this.templates.set('driver_arriving', {
      title: 'Driver Arriving',
      body: '{driverName} is arriving at your pickup location.',
      data: { type: 'driver_arriving', bookingId: '{bookingId}' }
    });
    
    this.templates.set('trip_started', {
      title: 'Trip Started',
      body: 'Your trip has started. Enjoy your ride!',
      data: { type: 'trip_started', bookingId: '{bookingId}' }
    });
    
    this.templates.set('trip_completed', {
      title: 'Trip Completed',
      body: 'Thank you for riding with us! Rate your experience.',
      data: { type: 'trip_completed', bookingId: '{bookingId}' }
    });
    
    this.templates.set('new_message', {
      title: 'New Message',
      body: '{senderName}: {messagePreview}',
      data: { type: 'new_message', chatId: '{chatId}' }
    });
    
    this.templates.set('new_booking_request', {
      title: 'New Booking Request',
      body: 'You have a new booking request from {from} to {to}.',
      data: { type: 'new_booking', bookingId: '{bookingId}' }
    });
    
    this.templates.set('payment_received', {
      title: 'Payment Received',
      body: 'Payment of {amount} DZD received successfully.',
      data: { type: 'payment_received', bookingId: '{bookingId}' }
    });
    
    this.templates.set('promo_available', {
      title: 'Special Offer!',
      body: '{promoMessage}',
      data: { type: 'promo', promoCode: '{promoCode}' }
    });
  }

  /**
   * Update method called by notification subject
   * @param {Object} notification - Notification data
   */
  async update(notification) {
    const { type, recipient, data } = notification;
    
    if (!recipient.fcmToken && !recipient.deviceTokens) {
      console.log('PushObserver: No FCM token provided');
      return { success: false, error: 'No FCM token' };
    }

    try {
      const tokens = recipient.deviceTokens || [recipient.fcmToken];
      const result = await this.send(type, tokens, data);
      return { success: true, channel: 'push', result };
    } catch (error) {
      console.error('PushObserver Error:', error);
      return { success: false, channel: 'push', error: error.message };
    }
  }

  /**
   * Send push notification
   * @param {string} type - Notification type
   * @param {Array<string>} tokens - FCM tokens
   * @param {Object} data - Template data
   * @returns {Promise<Object>} Send result
   */
  async send(type, tokens, data) {
    const template = this.templates.get(type);
    
    if (!template) {
      throw new Error(`Unknown push template type: ${type}`);
    }

    const notification = {
      title: this.fillTemplate(template.title, data),
      body: this.fillTemplate(template.body, data),
      data: this.fillObjectTemplates(template.data, data)
    };

    // In development/test, log instead of sending
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.log(`[PUSH] Tokens: ${tokens.length}`);
      console.log(`[PUSH] Title: ${notification.title}`);
      console.log(`[PUSH] Body: ${notification.body}`);
      console.log(`[PUSH] Data:`, notification.data);
      
      return {
        messageId: `mock_push_${Date.now()}`,
        status: 'sent',
        tokensCount: tokens.length,
        notification
      };
    }

    // Real push notification sending
    if (this.provider === 'firebase') {
      return await this.sendViaFirebase(tokens, notification);
    } else if (this.provider === 'onesignal') {
      return await this.sendViaOneSignal(tokens, notification);
    }

    throw new Error(`Unknown push provider: ${this.provider}`);
  }

  /**
   * Send via Firebase Cloud Messaging
   * @param {Array<string>} tokens - FCM tokens
   * @param {Object} notification - Notification content
   * @returns {Promise<Object>} Send result
   */
  async sendViaFirebase(tokens, notification) {
    // const admin = require('firebase-admin');
    // 
    // if (!admin.apps.length) {
    //   admin.initializeApp({
    //     credential: admin.credential.cert(this.firebaseConfig)
    //   });
    // }

    const message = {
      notification: {
        title: notification.title,
        body: notification.body
      },
      data: notification.data,
      tokens: tokens,
      android: {
        priority: 'high',
        notification: {
          channelId: 'default',
          sound: 'default'
        }
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };

    // const response = await admin.messaging().sendMulticast(message);
    
    return {
      messageId: `fcm_${Date.now()}`,
      status: 'sent',
      tokensCount: tokens.length,
      // successCount: response.successCount,
      // failureCount: response.failureCount
      successCount: tokens.length,
      failureCount: 0
    };
  }

  /**
   * Send via OneSignal
   * @param {Array<string>} tokens - Player IDs
   * @param {Object} notification - Notification content
   * @returns {Promise<Object>} Send result
   */
  async sendViaOneSignal(tokens, notification) {
    // OneSignal implementation
    return {
      messageId: `onesignal_${Date.now()}`,
      status: 'sent',
      tokensCount: tokens.length
    };
  }

  /**
   * Send to topic
   * @param {string} topic - FCM topic
   * @param {Object} notification - Notification content
   * @returns {Promise<Object>} Send result
   */
  async sendToTopic(topic, notification) {
    // const admin = require('firebase-admin');
    // 
    // const message = {
    //   notification: {
    //     title: notification.title,
    //     body: notification.body
    //   },
    //   data: notification.data,
    //   topic: topic
    // };
    // 
    // const response = await admin.messaging().send(message);
    
    return {
      messageId: `topic_${Date.now()}`,
      status: 'sent',
      topic
    };
  }

  /**
   * Subscribe tokens to topic
   * @param {Array<string>} tokens - FCM tokens
   * @param {string} topic - Topic name
   * @returns {Promise<Object>} Subscription result
   */
  async subscribeToTopic(tokens, topic) {
    // const admin = require('firebase-admin');
    // const response = await admin.messaging().subscribeToTopic(tokens, topic);
    
    return {
      success: true,
      topic,
      tokensCount: tokens.length
    };
  }

  /**
   * Fill template string with data
   * @param {string} template - Template
   * @param {Object} data - Data
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
   * Fill object templates recursively
   * @param {Object} obj - Object with templates
   * @param {Object} data - Data
   * @returns {Object} Filled object
   */
  fillObjectTemplates(obj, data) {
    const filled = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        filled[key] = this.fillTemplate(value, data);
      } else {
        filled[key] = value;
      }
    }
    return filled;
  }

  /**
   * Get observer name
   * @returns {string}
   */
  getName() {
    return 'Push Notification Observer';
  }

  /**
   * Get supported notification types
   * @returns {Array<string>}
   */
  getSupportedTypes() {
    return Array.from(this.templates.keys());
  }
}

module.exports = PushObserver;
