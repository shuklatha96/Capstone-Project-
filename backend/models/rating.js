const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  mid: { type: String, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
});

module.exports = mongoose.model('Rating', ratingSchema);
