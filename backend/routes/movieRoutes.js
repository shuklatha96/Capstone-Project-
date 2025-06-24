console.log("✅ movieRoutes.js is loaded");

const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const Review = require('../models/review');
const { isAdmin } = require('../middleware/authMiddleware');

// Test Route
router.get('/test', (req, res) => {
  res.send('Movie route is working');
});

// ✅ Only Admin can add a movie
// ✅ Only Admin can add a movie
router.post('/', isAdmin, async (req, res) => {
  try {
    const { name, cast, genre, duration, year, description, imageUrl, type } = req.body;

    if (!name || !cast || !genre || !duration || !year || !description || !imageUrl || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const movie = new Movie({ name, cast, genre, duration, year, description, imageUrl, type, addedByAdmin: true });
    await movie.save();
    res.status(201).json(movie);
  } catch (err) {
    console.error("Error in adding movie:", err);
    res.status(500).json({ message: 'Error adding movie' });
  }
});


// ✅ Public: Get all movies or filter by type and include average rating
router.get('/', async (req, res) => {
  try {
    const { type } = req.query; // Get type from query parameters
    let query = {};
    if (type) {
      query.type = type; // Add type to query if provided
    }
    const movies = await Movie.find(query).lean(); // Use .lean() for plain JavaScript objects

    // Calculate average rating for each movie
    const moviesWithRatings = await Promise.all(
      movies.map(async (movie) => {
        const reviews = await Review.find({ mid: movie._id.toString() });
        let averageRating = 0;
        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.score, 0);
          averageRating = totalRating / reviews.length;
        }
        return { ...movie, averageRating };
      })
    );

    res.json(moviesWithRatings);
  } catch (err) {
    console.error("Error fetching movies with ratings:", err);
    res.status(500).json({ message: 'Error fetching movies' });
  }
});

// ✅ Public: Get a single featured movie with average rating
router.get('/featured', async (req, res) => {
  try {
    const movie = await Movie.findOne({ isFeatured: true }).lean();
    if (!movie) {
      return res.status(404).json({ message: 'No featured movie found' });
    }

    const reviews = await Review.find({ mid: movie._id.toString() });
    let averageRating = 0;
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.score, 0);
      averageRating = totalRating / reviews.length;
    }

    res.json({ ...movie, averageRating });
  } catch (err) {
    console.error("Error fetching featured movie:", err);
    res.status(500).json({ message: 'Error fetching featured movie' });
  }
});

// ✅ Only Admin can delete a movie
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const result = await Movie.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting movie' });
  }
});

// ✅ Only Admin can update a movie
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const { name, cast, genre, duration, year, description, imageUrl, type } = req.body;

    if (!name || !cast || !genre || !duration || !year || !description || !imageUrl || !type) {
      return res.status(400).json({ message: "All fields are required for update" });
    }

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { name, cast, genre, duration, year, description, imageUrl, type },
      { new: true, runValidators: true } // new: true returns the updated document, runValidators ensures schema validations are run
    );

    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (err) {
    console.error("Error in updating movie:", err);
    res.status(500).json({ message: 'Error updating movie' });
  }
});

// Public: Search movies by name, only returning those added by admin
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const movies = await Movie.find({
      name: { $regex: query, $options: 'i' }, // Case-insensitive search by name
      addedByAdmin: true // Only show movies added by admin
    }).lean();

    if (movies.length === 0) {
      console.log("Backend: No movies found for query.");
      return res.status(200).json({ message: 'No movie found.', results: [] });
    }

    // Calculate average rating for each movie
    const moviesWithRatings = await Promise.all(
      movies.map(async (movie) => {
        const reviews = await Review.find({ mid: movie._id.toString() });
        let averageRating = 0;
        if (reviews.length > 0) {
          const totalRating = reviews.reduce((sum, review) => sum + review.score, 0);
          averageRating = totalRating / reviews.length;
        }
        return { ...movie, averageRating };
      })
    );

    res.json(moviesWithRatings);
  } catch (err) {
    console.error("Error searching movies:", err);
    res.status(500).json({ message: 'Error searching movies' });
  }
});

module.exports = router;
