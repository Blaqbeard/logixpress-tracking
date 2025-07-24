# LogiXpress - Logistics Tracking Platform

A logistics platform for real-time shipment tracking, notifications, analytics, and driver management.

## Features

- Real-time package tracking
- User authentication
- Delivery status updates
- Notifications (email/SMS via Twilio)
- Analytics dashboard
- Driver and shipment management
- Responsive frontend UI

## Tech Stack

- Node.js (Express) backend
- MongoDB (via Mongoose)
- Twilio (notifications)
- HTML5, CSS3, JavaScript (frontend)
- Deployed backend: [Render](https://logixpress-tracking.onrender.com)
- Deployed frontend: [GitHub Pages](https://blaqbeard.github.io/logixpress-tracking)

## Installation (Development)

1. Clone the repository

```bash
git clone https://github.com/Blaqbeard/logixpress-tracking.git
```

2. Install backend dependencies

```bash
cd backend
npm install
```

3. Create a `.env` file in the `backend/` directory with the following variables:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

4. Start the backend server

```bash
npm start
```

5. Open the frontend

- The frontend is in the `docs/` directory. Open `docs/index.html` in your browser for local testing.

## Deployment

### Backend (Render)

- The backend is deployed on Render: [https://logixpress-tracking.onrender.com](https://logixpress-tracking.onrender.com)
- Ensure your environment variables are set in the Render dashboard.
- CORS is configured to allow requests from the GitHub Pages frontend.

### Frontend (GitHub Pages)

- The frontend is deployed at: [https://blaqbeard.github.io/logixpress-tracking](https://blaqbeard.github.io/logixpress-tracking)
- All API calls in the frontend use the Render backend URL.

## Project Structure

```
Project 1-LogiXpress/
├── backend/
│   ├── app.js
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── package.json
│   └── ...
├── docs/           # Frontend (static site)
│   ├── index.html
│   ├── main.js
│   ├── ...
├── images/
├── README.md
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

David Usoro - [davidusoroh@outlook.com](mailto:davidusoroh@outlook.com)

Project Link: [https://github.com/Blaqbeard/logixpress-tracking](https://github.com/Blaqbeard/logixpress-tracking)
