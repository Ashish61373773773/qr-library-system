const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage (temporary solution until MongoDB is set up)
let visitors = [
  { _id: '1', visitorId: 'V001', name: 'Ashish Kumar', email: 'ashish@example.com', phone: '1234567890', createdAt: new Date() },
  { _id: '2', visitorId: 'V002', name: 'Priya Sharma', email: 'priya@example.com', phone: '9876543210', createdAt: new Date() },
  { _id: '3', visitorId: 'V003', name: 'Rahul Singh', email: 'rahul@example.com', phone: '5556667777', createdAt: new Date() }
];

let checkins = [
  { _id: '1', visitorId: 'V001', bookId: 'B001', checkinTime: new Date(Date.now() - 2 * 60 * 60 * 1000), status: 'checked-out', checkoutTime: new Date(Date.now() - 1 * 60 * 60 * 1000) },
  { _id: '2', visitorId: 'V002', bookId: 'B002', checkinTime: new Date(Date.now() - 1 * 60 * 60 * 1000), status: 'checked-in' },
  { _id: '3', visitorId: 'V003', bookId: 'B003', checkinTime: new Date(Date.now() - 30 * 60 * 1000), status: 'checked-out', checkoutTime: new Date(Date.now() - 15 * 60 * 1000) },
  { _id: '4', visitorId: 'V001', bookId: 'B004', checkinTime: new Date(Date.now() - 10 * 60 * 1000), status: 'checked-in' }
];

// Simple authentication (in production, use proper database)
const ADMIN_EMAIL = 'admin@library.com';
const ADMIN_PASSWORD = 'admin123';

// Login route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = 'fake-jwt-token-for-development';
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware to verify token (simplified for development)
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token || token !== 'fake-jwt-token-for-development') {
    return res.status(401).json({ message: 'Access denied' });
  }
  next();
};

// Routes - using in-memory data for development
// Visitors routes
app.get('/api/visitors', verifyToken, (req, res) => {
  res.json(visitors);
});

app.post('/api/visitors', verifyToken, (req, res) => {
  const newVisitor = {
    _id: String(Date.now()),
    ...req.body,
    createdAt: new Date()
  };
  visitors.push(newVisitor);
  res.status(201).json(newVisitor);
});

app.get('/api/visitors/:id', verifyToken, (req, res) => {
  const visitor = visitors.find(v => v._id === req.params.id);
  if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
  res.json(visitor);
});

// Checkins routes
app.get('/api/checkins', verifyToken, (req, res) => {
  res.json(checkins);
});

app.post('/api/checkins/scan', verifyToken, (req, res) => {
  const { visitorId, bookId } = req.body;
  const newCheckin = {
    _id: String(Date.now()),
    visitorId,
    bookId,
    checkinTime: new Date(),
    status: 'checked-in'
  };
  checkins.push(newCheckin);
  res.json({ message: 'Check-in successful', checkin: newCheckin });
});

app.get('/api/checkins/stats/dashboard', verifyToken, (req, res) => {
  const totalVisits = checkins.length;
  const currentVisitors = checkins.filter(c => c.status === 'checked-in').length;
  const averageDuration = 45; // Mock data
  const recentActivity = checkins.slice(-5).map(c => ({
    visitorId: c.visitorId,
    status: c.status,
    checkinTime: c.checkinTime
  }));

  res.json({
    totalVisits,
    currentVisitors,
    averageDuration,
    recentActivity
  });
});

// Generate QR code endpoint (for compatibility)
app.post('/api/checkins/generate-qr', verifyToken, (req, res) => {
  const { visitorId, bookId } = req.body;
  // Return a placeholder - frontend generates QR locally now
  res.json({
    qrCode: 'generated-locally',
    data: { visitorId, bookId }
  });
});

// Books routes (mock)
app.get('/api/books', verifyToken, (req, res) => {
  const books = [
    { _id: '1', bookId: 'B001', title: 'Introduction to Algorithms', author: 'Cormen', available: true },
    { _id: '2', bookId: 'B002', title: 'Clean Code', author: 'Robert Martin', available: true },
    { _id: '3', bookId: 'B003', title: 'Design Patterns', author: 'Gang of Four', available: false }
  ];
  res.json(books);
});

console.log('🚀 Server running with in-memory database (development mode)');
console.log('📝 Test data loaded successfully');
console.log(`🌐 Server listening on port ${PORT}`);

app.listen(PORT, () => {
  console.log(`✅ Server started successfully on port ${PORT}`);
});