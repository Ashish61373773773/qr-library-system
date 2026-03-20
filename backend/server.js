const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/library-qr', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('MongoDB connected');

  // Seed test data
  await seedTestData();
})
.catch(err => console.log(err));

// Seed test data function
async function seedTestData() {
  try {
    const Visitor = require('./models/Visitor');
    const Checkin = require('./models/Checkin');

    // Check if data already exists
    const visitorCount = await Visitor.countDocuments();
    if (visitorCount > 0) {
      console.log('Test data already exists');
      return;
    }

    // Create test visitors
    const visitors = [
      { visitorId: 'V001', name: 'Ashish Kumar', email: 'ashish@example.com' },
      { visitorId: 'V002', name: 'Priya Sharma', email: 'priya@example.com' },
      { visitorId: 'V003', name: 'Rahul Singh', email: 'rahul@example.com' }
    ];

    for (const visitorData of visitors) {
      const visitor = new Visitor(visitorData);
      await visitor.save();
    }

    // Create test check-ins
    const checkins = [
      { visitorId: 'V001', bookId: 'B001', checkinTime: new Date(Date.now() - 2 * 60 * 60 * 1000), status: 'checked-out', checkoutTime: new Date(Date.now() - 1 * 60 * 60 * 1000) },
      { visitorId: 'V002', bookId: 'B002', checkinTime: new Date(Date.now() - 1 * 60 * 60 * 1000), status: 'checked-in' },
      { visitorId: 'V003', bookId: 'B003', checkinTime: new Date(Date.now() - 30 * 60 * 1000), status: 'checked-out', checkoutTime: new Date(Date.now() - 15 * 60 * 1000) },
      { visitorId: 'V001', bookId: 'B004', checkinTime: new Date(Date.now() - 10 * 60 * 1000), status: 'checked-in' }
    ];

    for (const checkinData of checkins) {
      const checkin = new Checkin(checkinData);
      await checkin.save();
    }

    console.log('✅ Test data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding test data:', error);
  }
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/visitors', require('./routes/visitors'));
app.use('/api/books', require('./routes/books'));
app.use('/api/checkins', require('./routes/checkins'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});