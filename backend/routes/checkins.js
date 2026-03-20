const express = require('express');
const Checkin = require('../models/Checkin');
const Visitor = require('../models/Visitor');
const Book = require('../models/Book');
const authRouter = require('./auth');
const { verifyToken } = authRouter;
const QRCode = require('qrcode');
const router = express.Router();

// Get all checkins
router.get('/', verifyToken, async (req, res) => {
  try {
    const checkins = await Checkin.find().sort({ checkinTime: -1 });
    res.json(checkins);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Scan QR - Check in or out
router.post('/scan', verifyToken, async (req, res) => {
  const { visitorId, bookId } = req.body;

  try {
    // Check if visitor exists
    const visitor = await Visitor.findOne({ visitorId });
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });

    // Check if book exists (optional)
    if (bookId) {
      const book = await Book.findOne({ bookId });
      if (!book) return res.status(404).json({ message: 'Book not found' });
    }

    // Check if visitor is currently checked in
    const currentCheckin = await Checkin.findOne({ visitorId, status: 'checked-in' });

    if (currentCheckin) {
      // Check out
      currentCheckin.checkoutTime = new Date();
      currentCheckin.status = 'checked-out';
      await currentCheckin.save();
      res.json({ message: 'Checked out successfully', checkin: currentCheckin });
    } else {
      // Check in
      const checkin = new Checkin({ visitorId, bookId });
      await checkin.save();
      res.json({ message: 'Checked in successfully', checkin });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get dashboard stats
router.get('/stats/dashboard', verifyToken, async (req, res) => {
  try {
    const totalVisits = await Checkin.countDocuments();
    const currentVisitors = await Checkin.countDocuments({ status: 'checked-in' });
    const recentActivity = await Checkin.find().sort({ checkinTime: -1 }).limit(10);

    // Calculate average duration (simplified)
    const completedCheckins = await Checkin.find({ status: 'checked-out' });
    let totalDuration = 0;
    completedCheckins.forEach(checkin => {
      totalDuration += checkin.checkoutTime - checkin.checkinTime;
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