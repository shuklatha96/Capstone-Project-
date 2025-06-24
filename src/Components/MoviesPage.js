import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import '../styles/MoviesPage.css'; // We'll create this soon
import FlipCard from './FlipCard'; // Import the new FlipCard component
import ReviewModal from './ReviewModal'; // Import ReviewModal
import { getReviews, submitReview } from './reviewAPI'; // Import necessary review functions

const MoviesPage = ({ user }) => { // Accept user prop
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [selectedMovieToReview, setSelectedMovieToReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    // Fetch all movies for the 'New Releases' section
    fetch('http://localhost:5000/api/movies')
      .then(res => res.json())
      .then(data => {
        // Sort by createdAt or a 'releaseDate' if available, to get new releases
        // For now, just taking a subset as 'new releases'
        setMovies(data.slice(0, 12)); // Display first 12 as example
        // Select a few for featured carousel
        setFeaturedMovies(data.slice(0, 3)); // First 3 as featured
      })
      .catch(error => console.error("Error fetching movies:", error));
  }, []);

  const handleReviewClick = (movie) => {
    setSelectedMovieToReview(movie);
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setSelectedMovieToReview(null);
    setShowReviewModal(false);
    // Re-fetch reviews or update state if needed after closing modal
  };

  return (
    <div className="movies-page-container">
      {/* Featured Movie Spotlight Carousel */}
      <div className="featured-carousel-section mb-5">
        <h2 className="section-title">Featured Spotlight</h2>
        <Carousel fade indicators={false} controls={false} interval={5000} pause={false}>
          {featuredMovies.map((movie, index) => (
            <Carousel.Item key={movie._id || index}>
              <div className="carousel-item-content" style={{ backgroundImage: `url(${movie.imageUrl})` }}>
                <div className="overlay"></div>
                <Carousel.Caption className="carousel-caption-custom">
                  <h3>{movie.name}</h3>
                  <p>{movie.description?.substring(0, 150)}...</p>
                  <button className="btn btn-danger">Watch Now</button>
                </Carousel.Caption>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      {/* New Releases / All Movies Grid */}
      <div className="new-releases-section">
        <h2 className="section-title">New & Trending Movies</h2>
        <div className="row g-4">
          {movies.map((movie, index) => (
            <div className="col-md-3 col-sm-4 col-6" key={movie._id || index}>
              <FlipCard movie={movie} onReviewClick={handleReviewClick} />
            </div>
          ))}
        </div>
      </div>

      {/* Review Modal for details and reviews */}
      {selectedMovieToReview && (
        <ReviewModal
          selectedMovie={selectedMovieToReview}
          show={showReviewModal}
          onClose={handleCloseReviewModal}
          user={user}
          submitReview={submitReview}
          getReviews={getReviews}
        />
      )}
    </div>
  );
};

export default MoviesPage; 