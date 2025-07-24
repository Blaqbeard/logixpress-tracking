# LogiXpress Backend

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/logixpress

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Twilio SMS Configuration
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# Server Configuration
PORT=5000
```

### 3. Email Setup (Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. Use the generated password as `EMAIL_PASSWORD`

### 4. SMS Setup (Twilio)

1. Sign up for a Twilio account at https://www.twilio.com
2. Get your Account SID and Auth Token from the Twilio Console
3. Get a Twilio phone number for sending SMS
4. Add these to your `.env` file

### 5. Start the Server

```bash
npm start
```

## Features

### Real-time Notifications

- **Email Alerts**: Senders receive detailed HTML emails when shipments are created
- **SMS Alerts**: Senders receive SMS notifications for shipment status updates
- **Professional Templates**: Beautiful, responsive email templates with shipment details

### Notification Types

1. **Shipment Creation**: Sent immediately when a shipment is created
2. **Pickup Notification**: Sent when shipment is picked up (future)
3. **Delivery Notification**: Sent when shipment is delivered (future)

### Email Template Features

- Professional HTML design with gradients
- Complete shipment details
- Tracking information
- Sender and recipient details
- Package information
- Shipment preferences
- Responsive design for mobile devices

### SMS Features

- Concise, informative messages
- Tracking number included
- Status updates
- Professional branding
