const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const Movie = require('../models/movie');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Get reviews by the logged-in user
router.get('/user', isAuthenticated, async (req, res) => {
  try {
    const uid = req.user.id;
    const reviews = await Review.find({ uid }).populate('uid', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews for a specific movie by movie ID
router.get('/:mid', async (req, res) => {
  try {
    const reviews = await Review.find({ mid: req.params.mid }).populate('uid', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all reviews or reviews filtered by movie ID as a query param
router.get('/', async (req, res) => {
  try {
    const { mid } = req.query;
    const reviews = mid 
      ? await Review.find({ mid }).populate('uid', 'name')
      : await Review.find().populate('uid', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new review (only authenticated users)
router.post('/', isAuthenticated, async (req, res) => {
  const { imdbID, name, cast, genre, duration, year, description, score, msg, mid } = req.body;
  const uid = req.user.id;

  if ((!imdbID && !mid) || score == null || !msg) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let movieId = mid;

    // If imdbID is provided, handle API movie logic
    if (imdbID) {
      let movie = await Movie.findOne({ imdbID });
      if (!movie) {
        movie = new Movie({
          name,
          cast: cast || '',
          genre: genre || '',
          duration: duration || '',
          year: year || '',
          description: description || '',
          imdbID,
        });
        await movie.save();
      }
      movieId = movie._id;
    }

    // Check if user already reviewed the movie
    const existing = await Review.findOne({ uid, mid: movieId });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this movie' });
    }

    const newReview = new Review({ uid, mid: movieId, score, msg });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a review (Admin access might be needed, using isAuthenticated for now)
router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Optional: Add logic here to check if the user is an admin
    // For example: if (req.user.role !== 'admin') { return res.status(403).json({ message: 'Access denied' }); }

    await review.deleteOne(); // Use deleteOne() as remove() is deprecated
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error("Error deleting review:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;