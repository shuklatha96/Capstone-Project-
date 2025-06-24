const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  uid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mid: { type: String, required: true },
  score: { type: Number, required: true, min: 1, max: 5 },
  msg: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
