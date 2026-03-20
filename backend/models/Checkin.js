const mongoose = require('mongoose');

const checkinSchema = new mongoose.Schema({
  visitorId: { type: String, required: true },
  bookId: { type: String },
  checkinTime: { type: Date, default: Date.now },
  checkoutTime: { type: Date },
  status: { type: String, enum: ['checked-in', 'checked-out'], default: 'checked-in' }
});

module.exports = mongoose.model('Checkin', checkinSchema);