import React, { useState } from 'react';
import './FlipCard.css'; // Corrected import statement
import { renderStars } from "../utils/renderStars"; // Assuming this path

const FlipCard = ({ movie, onReviewClick }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleReviewClickInternal = (e) => {
    e.stopPropagation(); // Prevent card from flipping when clicking the button
    if (onReviewClick) {
      onReviewClick(movie);
    }
  };

  return (
    <div className="flip-card-container" onClick={handleFlip}>
      <div className={`flip-card ${isFlipped ? 'flipped' : ''}`}>
        <div className="flip-card-front">
          <img src={movie.imageUrl || "/images/fallback.jpg"} alt={movie.name} className="flip-card-image" />
          <h5 className="flip-card-title mt-2">{movie.name}</h5>
          {movie.averageRating && (
            <div className="flip-card-rating mb-2">
              {renderStars(movie.averageRating)}
            </div>
          )}
        </div>
        <div className="flip-card-back">
          <h5 className="flip-card-back-title">{movie.name}</h5>
          <p className="flip-card-text"><small>Year: {movie.year}</small></p>
          <p className="flip-card-text"><small>Genre: {movie.genre}</small></p>
          <p className="flip-card-text"><small>Cast: {movie.cast || 'N/A'}</small></p>
          <p className="flip-card-description"><small>{movie.description?.substring(0, 100)}...</small></p>
          {movie.averageRating && (
            <div className="flip-card-rating mb-2">
              Average: {renderStars(movie.averageRating)}
            </div>
          )}
          <button className="btn btn-danger btn-sm mt-2" onClick={handleReviewClickInternal}>
            View Details & Reviews
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlipCard; 