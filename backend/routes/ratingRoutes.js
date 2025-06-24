const express = require('express');
const router = express.Router();
const Rating = require('../models/rating');
const { isAuthenticated } = require('../middleware/authMiddleware'); // adjust path

// Submit or update rating — require logged-in user
router.post('/', isAuthenticated, async (req, res) => {
  try {
    const { mid, stars } = req.body;
    const uid = req.user.id || req.user._id || req.user.uid; // get user id from token

    if (!uid) return res.status(400).json({ message: 'User ID missing from token' });
    if (!mid || stars == null) return res.status(400).json({ message: 'Movie ID and stars required' });

    let rating = await Rating.findOne({ uid, mid });

    if (rating) {
      rating.stars = stars;
      await rating.save();
      return res.json({ message: 'Rating updated', rating });
    }

    rating = new Rating({ uid, mid, stars });
    await rating.save();
    res.json({ message: 'Rating submitted', rating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get average rating of a movie (public)
router.get('/:movieId', async (req, res) => {
  try {
    const movieId = req.params.movieId;
    const ratings = await Rating.find({ mid: movieId });

    const avg =
      ratings.reduce((acc, curr) => acc + curr.stars, 0) /
      (ratings.length || 1);

    res.json({ avgRating: avg.toFixed(1), totalRatings: ratings.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
