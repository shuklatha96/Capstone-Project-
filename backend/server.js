require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB connection error:", err.message));

// Import routes
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const ratingRoutes = require('./routes/ratingRoutes'); // <-- added ratingRoutes

// Mount routes
app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ratings', ratingRoutes);  // <-- mounted ratingRoutes here

// (Optional) You can remove the old moviereviews routes if no longer used
// app.get('/moviereviews', ...);
// app.post('/moviereviews', ...);
// app.get('/moviereviews/:imdbID', ...);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
