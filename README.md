# QR-Based Library Check-in System

A modern library management system that uses QR codes for efficient visitor check-in and check-out.

## Features

- **Dashboard**: Real-time statistics and activity overview
- **QR Scanning**: Camera-based QR code scanning for check-in/check-out
- **QR Generation**: Generate QR codes for visitors and books
- **Visitor Log**: Comprehensive check-in/check-out records
- **Admin Authentication**: Secure login system

## Technology Stack

- **Backend**: Node.js, Express.js, MongoDB
- **Frontend**: React, Material-UI, Vite
- **Authentication**: JWT
- **QR Code**: qrcode library for generation, react-qr-scanner for scanning

## Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```
   MONGODB_URI=mongodb://localhost:27017/library-qr
   JWT_SECRET=your-secret-key
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and go to `http://localhost:5173`
2. Login with admin credentials (email: admin@library.com, password: admin123)
3. Use the sidebar to navigate between different sections

### Admin Login

- Email: admin@library.com
- Password: admin123

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login

### Visitors
- `GET /api/visitors` - Get all visitors
- `POST /api/visitors` - Create new visitor

### Books
- `GET /api/books` - Get all books
- `POST /api/books` - Create new book

### Check-ins
- `GET /api/checkins` - Get all check-in records
- `POST /api/checkins/scan` - Scan QR code for check-in/check-out
- `GET /api/checkins/stats/dashboard` - Get dashboard statistics
- `POST /api/checkins/generate-qr` - Generate QR code

## Database Schema

### Visitor
- visitorId (String, unique)
- name (String)
- email (String)
- phone (String)

### Book
- bookId (String, unique)
- title (String)
- author (String)
- isbn (String)
- category (String)
- available (Boolean)

### Checkin
- visitorId (String)
- bookId (String, optional)
- checkinTime (Date)
- checkoutTime (Date, optional)
- status (String: 'checked-in' or 'checked-out')

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.