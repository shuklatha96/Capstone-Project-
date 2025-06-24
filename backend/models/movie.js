const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    name: { type: String, required: true },
    cast: { type: String, required: true },
    genre: { type: String, required: true },
    duration: { type: String, required: true },
    year: { type: Number, required: true },
    description: { type: String, required: true },
    imdbID: { type: String, unique: true, sparse: true },
    imageUrl: { type: String, required: true },
    type: { type: String, enum: ['Top Rated', 'Popular Movies', 'Trending This Week', 'TV Shows', 'Web Series'], default: 'Popular Movies' },
    isFeatured: { type: Boolean, default: false },
    addedByAdmin: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);