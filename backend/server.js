const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

// Import routes
const authRoutes = require('./routes/auth');
const visitorRoutes = require('./routes/visitors');
const checkinRoutes = require('./routes/checkins');
const bookRoutes = require('./routes/books');

// Import data
const { visitors, checkins, books } = require('./data');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/checkins', checkinRoutes);
app.use('/api/books', bookRoutes);

console.log('🚀 Server running with in-memory database (development mode)');
console.log('📝 Test data loaded successfully');
console.log(`🌐 Server listening on port ${PORT}`);

app.listen(PORT, () => {
  console.log(`✅ Server started successfully on port ${PORT}`);
});