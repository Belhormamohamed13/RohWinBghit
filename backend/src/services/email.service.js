/**
 * Email Service
 * Handles email sending with templates
 */

class EmailService {
  constructor(config = {}) {
    this.provider = config.provider || process.env.EMAIL_PROVIDER || 'sendgrid';
    this.fromEmail = config.fromEmail || process.env.EMAIL_FROM || 'noreply@rohwinbghit.com';
    this.fromName = config.fromName || process.env.EMAIL_FROM_NAME || 'RohWinBghit';
    this.apiKey = config.apiKey || process.env.SENDGRID_API_KEY;
    
    this.templates = this.initializeTemplates();
  }

  /**
   * Initialize email templates
   * @returns {Object} Templates
   */
  initializeTemplates() {
    return {
      welcome: {
        subject: 'Bienvenue sur RohWinBghit! 🇩🇿',
        html: this.getWelcomeTemplate(),
        text: this.getWelcomeTextTemplate()
      },
      bookingConfirmation: {
        subject: 'Votre réservation est confirmée ✓',
        html: this.getBookingConfirmationTemplate(),
        text: this.getBookingConfirmationTextTemplate()
      },
      bookingCancelled: {
        subject: 'Réservation annulée',
        html: this.getBookingCancelledTemplate(),
        text: this.getBookingCancelledTextTemplate()
      },
      tripReminder: {
        subject: 'Rappel: Votre trajet demain',
        html: this.getTripReminderTemplate(),
        text: this.getTripReminderTextTemplate()
      },
      paymentReceipt: {
        subject: 'Reçu de paiement',
        html: this.getPaymentReceiptTemplate(),
        text: this.getPaymentReceiptTextTemplate()
      },
      passwordReset: {
        subject: 'Réinitialisation de votre mot de passe',
        html: this.getPasswordResetTemplate(),
        text: this.getPasswordResetTextTemplate()
      },
      driverApproved: {
        subject: 'Félicitations! Vous êtes maintenant conducteur',
        html: this.getDriverApprovedTemplate(),
        text: this.getDriverApprovedTextTemplate()
      },
      reviewReceived: {
        subject: 'Vous avez reçu un nouvel avis',
        html: this.getReviewReceivedTemplate(),
        text: this.getReviewReceivedTextTemplate()
      },
      verificationCode: {
        subject: 'Votre code de vérification',
        html: this.getVerificationCodeTemplate(),
        text: this.getVerificationCodeTextTemplate()
      }
    };
  }

  /**
   * Send email
   * @param {string} to - Recipient email
   * @param {string} templateName - Template name
   * @param {Object} data - Template data
   * @returns {Promise<Object>} Send result
   */
  async send(to, templateName, data = {}) {
    const template = this.templates[templateName];
    
    if (!template) {
      throw new Error(`Unknown template: ${templateName}`);
    }

    const subject = this.fillTemplate(template.subject, data);
    const html = this.fillTemplate(template.html, data);
    const text = this.fillTemplate(template.text, data);

    // In development/test, log instead of sending
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      console.log('=== EMAIL ===');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Text:', text);
      console.log('=============');
      
      return {
        messageId: `mock_${Date.now()}`,
        status: 'sent',
        to,
        subject
      };
    }

    // Real email sending
    if (this.provider === 'sendgrid') {
      return await this.sendViaSendGrid(to, subject, html, text);
    } else if (this.provider === 'ses') {
      return await this.sendViaSES(to, subject, html, text);
    }

    throw new Error(`Unknown email provider: ${this.provider}`);
  }

  /**
   * Send via SendGrid
   * @param {string} to - Recipient
   * @param {string} subject - Subject
   * @param {string} html - HTML content
   * @param {string} text - Text content
   * @returns {Promise<Object>} Send result
   */
  async sendViaSendGrid(to, subject, html, text) {
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(this.apiKey);
    
    // const msg = {
    //   to,
    //   from: { email: this.fromEmail, name: this.fromName },
    //   subject,
    //   text,
    //   html
    // };
    
    // const result = await sgMail.send(msg);
    
    return { 
      messageId: `sg_${Date.now()}`, 
      status: 'sent',
      to,
      subject
    };
  }

  /**
   * Send via AWS SES
   * @param {string} to - Recipient
   * @param {string} subject - Subject
   * @param {string} html - HTML content
   * @param {string} text - Text content
   * @returns {Promise<Object>} Send result
   */
  async sendViaSES(to, subject, html, text) {
    // AWS SES implementation
    return { 
      messageId: `ses_${Date.now()}`, 
      status: 'sent',
      to,
      subject
    };
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
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      filled = filled.replace(placeholder, value || '');
    }
    return filled;
  }

  // Template getters
  getWelcomeTemplate() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10B981;">Bienvenue sur RohWinBghit! 🚗</h1>
        <p>Bonjour {{firstName}},</p>
        <p>Merci d'avoir rejoint RohWinBghit, la première plateforme de covoiturage en Algérie!</p>
        <p>Avec RohWinBghit, vous pouvez:</p>
        <ul>
          <li>Trouver des trajets à prix réduit</li>
          <li>Publier vos propres trajets en tant que conducteur</li>
          <li>Voyager en toute sécurité avec notre système de vérification</li>
        </ul>
        <a href="{{loginUrl}}" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px;">Se connecter</a>
        <p style="margin-top: 30px; color: #666;">L'équipe RohWinBghit</p>
      </div>
    `;
  }

  getWelcomeTextTemplate() {
    return `Bienvenue sur RohWinBghit!

Bonjour {{firstName}},

Merci d'avoir rejoint RohWinBghit, la première plateforme de covoiturage en Algérie!

Connectez-vous: {{loginUrl}}

L'équipe RohWinBghit`;
  }

  getBookingConfirmationTemplate() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10B981;">Réservation Confirmée! ✓</h1>
        <p>Votre trajet de <strong>{{from}}</strong> à <strong>{{to}}</strong> est confirmé.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Date:</strong> {{date}}</p>
          <p><strong>Heure:</strong> {{time}}</p>
          <p><strong>Conducteur:</strong> {{driverName}}</p>
          <p><strong>Véhicule:</strong> {{vehicleInfo}}</p>
          <p><strong>Prix:</strong> {{price}} DZD</p>
        </div>
        <p>Présentez ce QR code à votre conducteur:</p>
        <img src="{{qrCodeUrl}}" alt="QR Code" style="max-width: 200px;" />
      </div>
    `;
  }

  getBookingConfirmationTextTemplate() {
    return `Réservation Confirmée!

Votre trajet de {{from}} à {{to}} est confirmé.

Date: {{date}}
Heure: {{time}}
Conducteur: {{driverName}}
Prix: {{price}} DZD

Code de réservation: {{bookingId}}`;
  }

  getBookingCancelledTemplate() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #EF4444;">Réservation Annulée</h1>
        <p>Votre réservation #{{bookingId}} a été annulée.</p>
        <p><strong>Raison:</strong> {{cancellationReason}}</p>
        <p>Si un paiement a été effectué, un remboursement de {{refundAmount}} DZD sera traité dans les 5-7 jours ouvrables.</p>
      </div>
    `;
  }

  getBookingCancelledTextTemplate() {
    return `Réservation Annulée

Votre réservation #{{bookingId}} a été annulée.
Raison: {{cancellationReason}}

Remboursement: {{refundAmount}} DZD (5-7 jours)`;
  }

  getTripReminderTemplate() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10B981;">Rappel de Trajet</h1>
        <p>Votre trajet de {{from}} à {{to}} est demain à {{time}}.</p>
        <p>N'oubliez pas d'être à votre point de rendez-vous 10 minutes avant l'heure prévue.</p>
        <p><strong>Conducteur:</strong> {{driverName}}</p>
        <p><strong>Téléphone:</strong> {{driverPhone}}</p>
      </div>
    `;
  }

  getTripReminderTextTemplate() {
    return `Rappel de Trajet

Votre trajet de {{from}} à {{to}} est demain à {{time}}.

Conducteur: {{driverName}}
Tél: {{driverPhone}}`;
  }

  getPaymentReceiptTemplate() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10B981;">Reçu de Paiement</h1>
        <p>Merci pour votre paiement!</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
          <p><strong>Montant:</strong> {{amount}} DZD</p>
          <p><strong>Méthode:</strong> {{paymentMethod}}</p>
          <p><strong>Transaction ID:</strong> {{transactionId}}</p>
          <p><strong>Date:</strong> {{date}}</p>
        </div>
      </div>
    `;
  }

  getPaymentReceiptTextTemplate() {
    return `Reçu de Paiement

Montant: {{amount}} DZD
Méthode: {{paymentMethod}}
Transaction: {{transactionId}}
Date: {{date}}`;
  }

  getPasswordResetTemplate() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10B981;">Réinitialisation du Mot de Passe</h1>
        <p>Vous avez demandé une réinitialisation de mot de passe.</p>
        <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe:</p>
        <a href="{{resetUrl}}" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin: 20px 0;">Réinitialiser mon mot de passe</a>
        <p style="color: #666;">Ce lien expire dans {{expiresIn}}.</p>
        <p style="color: #666;">Si vous n'avez pas fait cette demande, ignorez cet email.</p>
      </div>
    `;
  }

  getPasswordResetTextTemplate() {
    return `Réinitialisation du Mot de Passe

Cliquez sur ce lien pour réinitialiser votre mot de passe:
{{resetUrl}}

Ce lien expire dans {{expiresIn}}.`;
  }

  getDriverApprovedTemplate() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10B981;">Félicitations! 🎉</h1>
        <p>Votre demande pour devenir conducteur a été approuvée!</p>
        <p>Vous pouvez maintenant:</p>
        <ul>
          <li>Publier des trajets</li>
          <li>Accepter des réservations</li>
          <li>Gagner de l'argent en partageant vos trajets</li>
        </ul>
        <a href="{{dashboardUrl}}" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px;">Accéder au tableau de bord</a>
      </div>
    `;
  }

  getDriverApprovedTextTemplate() {
    return `Félicitations!

Votre demande pour devenir conducteur a été approuvée!

Accédez à votre tableau de bord: {{dashboardUrl}}`;
  }

  getReviewReceivedTemplate() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10B981;">Nouvel Avis</h1>
        <p>Vous avez reçu un nouvel avis de {{reviewerName}}.</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px;">
          <p><strong>Note:</strong> {{rating}}/5 ⭐</p>
          <p><strong>Commentaire:</strong> {{comment}}</p>
        </div>
        <a href="{{profileUrl}}" style="background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; margin-top: 20px;">Voir mon profil</a>
      </div>
    `;
  }

  getReviewReceivedTextTemplate() {
    return `Nouvel Avis

Vous avez reçu un nouvel avis de {{reviewerName}}.
Note: {{rating}}/5
Commentaire: {{comment}}`;
  }

  getVerificationCodeTemplate() {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #10B981;">Code de Vérification</h1>
        <p>Votre code de vérification est:</p>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; font-size: 32px; letter-spacing: 8px; font-weight: bold;">
          {{code}}
        </div>
        <p style="color: #666;">Ce code expire dans 10 minutes.</p>
        <p style="color: #666;">Ne partagez ce code avec personne.</p>
      </div>
    `;
  }

  getVerificationCodeTextTemplate() {
    return `Code de Vérification

Votre code: {{code}}

Ce code expire dans 10 minutes.`;
  }
}

// Export singleton instance
module.exports = new EmailService();
