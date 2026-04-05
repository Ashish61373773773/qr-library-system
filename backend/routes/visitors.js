const express = require('express');
const authRouter = require('./auth');
const { verifyToken } = authRouter;
const { visitors } = require('../data');
const router = express.Router();

// Get all visitors
router.get('/', verifyToken, async (req, res) => {
  try {
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create visitor
router.post('/', verifyToken, async (req, res) => {
  try {
    const newVisitor = {
      _id: Date.now().toString(),
      ...req.body,
      createdAt: new Date()
    };
    visitors.push(newVisitor);
    res.status(201).json(newVisitor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get visitor by ID (for self check-in - public)
router.get('/:id', async (req, res) => {
  try {
    // Try to find by _id first, then by visitorId
    let visitor = visitors.find(v => v._id === req.params.id);
    if (!visitor) {
      visitor = visitors.find(v => v.visitorId === req.params.id);
    }
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
    res.json(visitor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;