const nodemailer = require("nodemailer");
const twilio = require("twilio");

// Email configuration
const emailTransporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use TLS
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "your-app-password",
  },
});

// Twilio configuration for SMS
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID || "your-account-sid",
  process.env.TWILIO_AUTH_TOKEN || "your-auth-token"
);

class NotificationService {
  // Send email notification
  async sendEmail(to, subject, htmlContent, from = null) {
    try {
      const mailOptions = {
        from: from || process.env.EMAIL_USER || "your-email@gmail.com",
        to: to,
        subject: subject,
        html: htmlContent,
      };

      const result = await emailTransporter.sendMail(mailOptions);
      console.log("Email sent successfully:", result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("Email sending failed:", error);
      return { success: false, error: error.message };
    }
  }

  // Send SMS notification
  async sendSMS(to, message) {
    try {
      const result = await twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER || "+1234567890",
        to: to,
      });

      console.log("SMS sent successfully:", result.sid);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error("SMS sending failed:", error);
      return { success: false, error: error.message };
    }
  }

  // Send shipment creation alert
  async sendShipmentCreationAlert(shipmentData) {
    const {
      sender,
      recipient,
      trackingNumber,
      package: packageDetails,
      preferences,
    } = shipmentData;

    // Email content
    const emailSubject = `LogiXpress Shipment Created: ${trackingNumber}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">LogiXpress Shipment Notification</h1>
        </div>
        <div style="padding: 20px; background: #f8f9fa;">
          <p style="font-size: 16px; color: #333;">Hello ${sender.name},</p>
          <p style="font-size: 15px; color: #333; margin-bottom: 20px;">
            Your shipment (Tracking ID: <strong>${trackingNumber}</strong>) has been successfully created and is now being processed. You will receive updates as your package moves through delivery.
          </p>
          <!-- Existing shipment details -->
          <div style="margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 20px;">Shipment Details</h2>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #667eea; margin-top: 0;">📋 Tracking Information</h3>
              <p><strong>Tracking Number:</strong> <span style="font-family: monospace; font-weight: bold; color: #667eea;">${trackingNumber}</span></p>
              <p><strong>Status:</strong> <span style="background: #fff3cd; color: #856404; padding: 4px 8px; border-radius: 4px;">Pending Pickup</span></p>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #667eea; margin-top: 0;">👤 Sender Information</h3>
              <p><strong>Name:</strong> ${sender.name}</p>
              <p><strong>Phone:</strong> ${sender.phone}</p>
              <p><strong>Email:</strong> ${sender.email}</p>
              <p><strong>Address:</strong> ${sender.address}</p>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #667eea; margin-top: 0;">📮 Recipient Information</h3>
              <p><strong>Name:</strong> ${recipient.name}</p>
              <p><strong>Phone:</strong> ${recipient.phone}</p>
              <p><strong>Address:</strong> ${recipient.address}</p>
              <p><strong>Country:</strong> ${recipient.country}</p>
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #667eea; margin-top: 0;">📦 Package Details</h3>
              <p><strong>Description:</strong> ${packageDetails.description}</p>
              <p><strong>Weight:</strong> ${packageDetails.weight} kg</p>
              <p><strong>Quantity:</strong> ${packageDetails.quantity}</p>
              ${
                packageDetails.value
                  ? `<p><strong>Value:</strong> $${packageDetails.value}</p>`
                  : ""
              }
            </div>
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
              <h3 style="color: #667eea; margin-top: 0;">⚙️ Shipment Preferences</h3>
              <p><strong>Delivery Type:</strong> ${
                preferences.deliveryType.charAt(0).toUpperCase() +
                preferences.deliveryType.slice(1)
              }</p>
              <p><strong>Insurance:</strong> ${
                preferences.insurance ? "Yes" : "No"
              }</p>
              <p><strong>Signature Required:</strong> ${
                preferences.signatureRequired ? "Yes" : "No"
              }</p>
              <p><strong>Notify Receiver:</strong> ${
                preferences.notifyReceiver ? "Yes" : "No"
              }</p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #666; font-size: 14px;">
              Thank you,<br>LogiXpress Team<br>
              <span style='color:#888;font-size:12px;'>For support, contact us at <a href='mailto:support@logixpress.com'>support@logixpress.com</a></span>
            </p>
          </div>
        </div>
      </div>
    `;

    // SMS content
    const smsMessage = `LogiXpress: Your shipment ${trackingNumber} has been created successfully! Status: Pending Pickup. We'll notify you when it's picked up.`;

    // Send notifications
    const results = {
      email: null,
      sms: null,
    };

    // Send email if email is provided
    if (sender.email) {
      results.email = await this.sendEmail(
        sender.email,
        emailSubject,
        emailHtml,
        '"LogiXpress Alerts" <' +
          (process.env.EMAIL_USER || "your-email@gmail.com") +
          ">"
      );
    }

    // Send SMS if phone is provided
    if (sender.phone) {
      results.sms = await this.sendSMS(sender.phone, smsMessage);
    }

    return results;
  }

  // Send pickup notification
  async sendPickupNotification(shipmentData) {
    const { sender, trackingNumber } = shipmentData;

    const emailSubject = `Shipment Picked Up - ${trackingNumber}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🚚 Shipment Picked Up!</h1>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Your shipment is now in transit</h2>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="color: #28a745; margin-top: 0;">📋 Tracking Information</h3>
            <p><strong>Tracking Number:</strong> <span style="font-family: monospace; font-weight: bold; color: #28a745;">${trackingNumber}</span></p>
            <p><strong>Status:</strong> <span style="background: #d4edda; color: #155724; padding: 4px 8px; border-radius: 4px;">In Transit</span></p>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #666; font-size: 14px;">
              Your package is now on its way! 🎉<br>
              We'll keep you updated on its progress.
            </p>
          </div>
        </div>
      </div>
    `;

    const smsMessage = `LogiXpress: Your shipment ${trackingNumber} has been picked up and is now in transit!`;

    const results = {
      email: null,
      sms: null,
    };

    if (sender.email) {
      results.email = await this.sendEmail(
        sender.email,
        emailSubject,
        emailHtml
      );
    }

    if (sender.phone) {
      results.sms = await this.sendSMS(sender.phone, smsMessage);
    }

    return results;
  }

  // Send delivery notification
  async sendDeliveryNotification(shipmentData) {
    const { sender, trackingNumber } = shipmentData;

    const emailSubject = `Shipment Delivered - ${trackingNumber}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">✅ Shipment Delivered!</h1>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Your shipment has been successfully delivered</h2>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="color: #007bff; margin-top: 0;">📋 Tracking Information</h3>
            <p><strong>Tracking Number:</strong> <span style="font-family: monospace; font-weight: bold; color: #007bff;">${trackingNumber}</span></p>
            <p><strong>Status:</strong> <span style="background: #d1ecf1; color: #0c5460; padding: 4px 8px; border-radius: 4px;">Delivered</span></p>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #666; font-size: 14px;">
              Thank you for using LogiXpress! 🎉<br>
              We hope you're satisfied with our service.
            </p>
          </div>
        </div>
      </div>
    `;

    const smsMessage = `LogiXpress: Your shipment ${trackingNumber} has been successfully delivered! Thank you for choosing our service.`;

    const results = {
      email: null,
      sms: null,
    };

    if (sender.email) {
      results.email = await this.sendEmail(
        sender.email,
        emailSubject,
        emailHtml
      );
    }

    if (sender.phone) {
      results.sms = await this.sendSMS(sender.phone, smsMessage);
    }

    return results;
  }

  // Send pickup notification
  async sendPickupNotification(shipmentData) {
    const { sender, trackingNumber } = shipmentData;

    const emailSubject = `Shipment Picked Up - ${trackingNumber}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">🚚 Shipment Picked Up!</h1>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Your shipment is now in transit</h2>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="color: #28a745; margin-top: 0;">📋 Tracking Information</h3>
            <p><strong>Tracking Number:</strong> <span style="font-family: monospace; font-weight: bold; color: #28a745;">${trackingNumber}</span></p>
            <p><strong>Status:</strong> <span style="background: #d4edda; color: #155724; padding: 4px 8px; border-radius: 4px;">In Transit</span></p>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #666; font-size: 14px;">
              Your package is now on its way! 🎉<br>
              We'll keep you updated on its progress.
            </p>
          </div>
        </div>
      </div>
    `;

    const smsMessage = `LogiXpress: Your shipment ${trackingNumber} has been picked up and is now in transit!`;

    const results = {
      email: null,
      sms: null,
    };

    if (sender.email) {
      results.email = await this.sendEmail(
        sender.email,
        emailSubject,
        emailHtml
      );
    }

    if (sender.phone) {
      results.sms = await this.sendSMS(sender.phone, smsMessage);
    }

    return results;
  }

  // Send delivery notification
  async sendDeliveryNotification(shipmentData) {
    const { sender, trackingNumber } = shipmentData;

    const emailSubject = `Shipment Delivered - ${trackingNumber}`;
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">✅ Shipment Delivered!</h1>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Your shipment has been successfully delivered</h2>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="color: #007bff; margin-top: 0;">📋 Tracking Information</h3>
            <p><strong>Tracking Number:</strong> <span style="font-family: monospace; font-weight: bold; color: #007bff;">${trackingNumber}</span></p>
            <p><strong>Status:</strong> <span style="background: #d1ecf1; color: #0c5460; padding: 4px 8px; border-radius: 4px;">Delivered</span></p>
          </div>
          
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #666; font-size: 14px;">
              Thank you for using LogiXpress! 🎉<br>
              We hope you're satisfied with our service.
            </p>
          </div>
        </div>
      </div>
    `;

    const smsMessage = `LogiXpress: Your shipment ${trackingNumber} has been successfully delivered! Thank you for choosing our service.`;

    const results = {
      email: null,
      sms: null,
    };

    if (sender.email) {
      results.email = await this.sendEmail(
        sender.email,
        emailSubject,
        emailHtml
      );
    }

    if (sender.phone) {
      results.sms = await this.sendSMS(sender.phone, smsMessage);
    }

    return results;
  }
}

module.exports = new NotificationService();
