const express = require('express');
const Visitor = require('../models/Visitor');
const authRouter = require('./auth');
const { verifyToken } = authRouter;
const router = express.Router();

// Get all visitors
router.get('/', verifyToken, async (req, res) => {
  try {
    const visitors = await Visitor.find();
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create visitor
router.post('/', verifyToken, async (req, res) => {
  const visitor = new Visitor(req.body);
  try {
    const newVisitor = await visitor.save();
    res.status(201).json(newVisitor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get visitor by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
    res.json(visitor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;