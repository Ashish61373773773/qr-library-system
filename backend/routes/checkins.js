const express = require('express');
const authRouter = require('./auth');
const { verifyToken } = authRouter;
const QRCode = require('qrcode');
const router = express.Router();

// In-memory storage for checkins
let checkins = [
  {
    _id: '1',
    visitorId: 'VIS001',
    bookId: null,
    checkinTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    checkoutTime: null,
    status: 'checked-in'
  },
  {
    _id: '2',
    visitorId: 'VIS002',
    bookId: null,
    checkinTime: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    checkoutTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    status: 'checked-out'
  }
];

// Get all checkins
router.get('/', verifyToken, async (req, res) => {
  try {
    const sortedCheckins = checkins.sort((a, b) => new Date(b.checkinTime) - new Date(a.checkinTime));
    res.json(sortedCheckins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Scan QR - Check in or out (Public endpoint for self check-in)
router.post('/scan', async (req, res) => {
  const { visitorId, bookId } = req.body;

  try {
    // Check if visitor exists (simplified check)
    const visitorExists = checkins.some(c => c.visitorId === visitorId) ||
                         visitorId === 'VIS001' || visitorId === 'VIS002' ||
                         visitors.some(v => v.visitorId === visitorId);

    if (!visitorExists) return res.status(404).json({ message: 'Visitor not found' });

    // Check if visitor is currently checked in
    const currentCheckin = checkins.find(c => c.visitorId === visitorId && c.status === 'checked-in');

    if (currentCheckin) {
      // Check out
      currentCheckin.checkoutTime = new Date();
      currentCheckin.status = 'checked-out';
      res.json({ message: 'Checked out successfully', checkin: currentCheckin });
    } else {
      // Check in
      const checkin = {
        _id: Date.now().toString(),
        visitorId,
        bookId,
        checkinTime: new Date(),
        checkoutTime: null,
        status: 'checked-in'
      };
      checkins.push(checkin);
      res.json({ message: 'Checked in successfully', checkin });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get dashboard stats
router.get('/stats/dashboard', verifyToken, async (req, res) => {
  try {
    const totalVisits = checkins.length;
    const currentVisitors = checkins.filter(c => c.status === 'checked-in').length;
    const recentActivity = checkins.sort((a, b) => new Date(b.checkinTime) - new Date(a.checkinTime)).slice(0, 10);

    // Calculate average duration (simplified)
    const completedCheckins = checkins.filter(c => c.status === 'checked-out');
    let totalDuration = 0;
    completedCheckins.forEach(checkin => {
      totalDuration += new Date(checkin.checkoutTime) - new Date(checkin.checkinTime);
    });
    const averageDuration = completedCheckins.length > 0 ? totalDuration / completedCheckins.length / 60000 : 0; // in minutes

    res.json({
      totalVisits,
      currentVisitors,
      averageDuration: Math.round(averageDuration),
      recentActivity
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate QR code
router.post('/generate-qr', verifyToken, async (req, res) => {
  const { visitorId, bookId } = req.body;
  const data = JSON.stringify({ visitorId, bookId });

  try {
    const qrCodeDataURL = await QRCode.toDataURL(data);
    res.json({ qrCode: qrCodeDataURL });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;