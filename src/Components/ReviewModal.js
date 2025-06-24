import React, { useEffect, useState } from "react";
import { getReviews, submitReview } from "./reviewAPI";
import axios from "axios";

export const renderStars = (score, isInteractive = false, hoverRating = 0, setHoverRating = () => {}, form = {}, setForm = () => {}) => {
  let safeScore = Number(score);
  if (isNaN(safeScore) || safeScore < 0) safeScore = 0;
  if (safeScore > 5) safeScore = 5;

  const stars = [];
  const displayScore = isInteractive && hoverRating > 0 ? hoverRating : safeScore;

  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span
        key={i}
        className="star"
        style={{
          cursor: isInteractive ? "pointer" : "default",
          color: i <= displayScore ? "gold" : "#CCCCCC", // Gold for selected, clear light grey for unselected
          fontSize: isInteractive ? "32px" : "18px", // 32px for interactive, 18px for display
          verticalAlign: "middle" // Align stars vertically
        }}
        onClick={isInteractive ? () => setForm({ ...form, rating: i }) : undefined}
        onMouseEnter={isInteractive ? () => setHoverRating(i) : undefined}
        onMouseLeave={isInteractive ? () => setHoverRating(0) : undefined}
      >
        ★
      </span>
    );
  }
  return <span className="review-stars">{stars}</span>;
};

const ReviewModal = ({ selectedMovie, show, onClose, user }) => {
  console.log("ReviewModal.js: received user prop:", user);
  const [reviews, setReviews] = useState([]);
  const [form, setForm] = useState({ comment: "", rating: 5 });
  const [hoverRating, setHoverRating] = useState(0); // For hover effect

  useEffect(() => {
    if (show && selectedMovie) {
      // Fetch reviews based on movie ID (MongoDB _id for admin, imdbID for API)
      const movieIdToFetch = selectedMovie._id || selectedMovie.imdbID;
      if (movieIdToFetch) {
        getReviews(movieIdToFetch).then(data => {
          console.log("ReviewModal: Fetched reviews data:", data);
          setReviews(data);
        });
      }
    }
  }, [show, selectedMovie]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to submit a review.");
      return;
    }

    if (!form.comment.trim()) {
      alert("Please enter a review comment.");
      return;
    }

    if (form.rating < 1 || form.rating > 5) {
      alert("Please select a rating between 1 and 5.");
      return;
    }

    try {
      // Submit review using the comprehensive movie data and review details
      await submitReview(selectedMovie, {
       score: form.rating,
       comment: form.comment,
      });

      // No longer need to submit rating separately, it's handled in reviewRoutes.js
      // await axios.post("http://localhost:5000/api/ratings", {
      //   uid: user._id,
      //   mid: selectedMovie._id, // This would be the MongoDB _id
      //   stars: form.rating,
      // });

      setForm({ comment: "", rating: 5 });
      // Refetch reviews to show the newly added one
      const movieIdToRefetch = selectedMovie._id || selectedMovie.imdbID;
      if (movieIdToRefetch) {
        getReviews(movieIdToRefetch).then(setReviews);
      }
      // Optionally close modal after successful submission, or keep it open
      // onClose(); 
    } catch (error) {
      console.error("Error submitting review or rating:", error);
      alert(`Failed to submit review: ${error.message}`);
    }
  };

  if (!show || !selectedMovie) return null;

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length // Use r.score instead of r.rating
    : 0;

  return (
    <div className="modal show d-block" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div className="modal-dialog modal-md modal-dialog-scrollable custom-modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{selectedMovie.name || selectedMovie.Title}</h5>
            <button type="button" className="btn-close" onClick={onClose} closeVariant="white"></button>
          </div>
          <div className="modal-body">
            {/* Movie Details Section */}
            <div className="movie-details-section mb-4 pb-3 border-bottom">
              <h6>Year: {selectedMovie.year}</h6>
              <p><strong>Description:</strong> {selectedMovie.description}</p>
              <p className="movie-cast-info"><strong>Cast:</strong> {selectedMovie.cast ? selectedMovie.cast : "Information not available yet."}</p>
            </div>

            {/* Panel 1: Display Reviews */}
            <div className="mb-4">
              <h6>Average Rating: {renderStars(averageRating, false, hoverRating, setHoverRating, form, setForm)} ({averageRating.toFixed(1)})</h6>
              <div className="border rounded p-3 review-display-panel">
                {reviews.length === 0 ? (
                  <p>No reviews yet.</p>
                ) : (
                  reviews.map((r, i) => (
                    <div key={r._id || i} className="mb-3 pb-2 border-bottom review-item">
                      <strong>{r.uid?.name || "Anonymous"}</strong> — {renderStars(r.score, false, hoverRating, setHoverRating, form, setForm)}
                      <p className="mb-0">{r.msg}</p>
                      <small>Reviewed on {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '/') : "-"}</small>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Panel 2: Submit Review - Always visible */}
            <div className="mt-4 submit-review-panel">
              {user ? (
                <form onSubmit={handleSubmit} className="review-form-panel mt-2">
                  <label className="form-label">Rating</label>
                  <div className="mb-3">
                    {renderStars(form.rating, true, hoverRating, setHoverRating, form, setForm)}
                  </div>
                  <label className="form-label">Comment *</label>
                  <textarea
                    className="form-control mb-2 custom-form-input"
                    placeholder="Share your thoughts about this movie..."
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    required
                  />
                  <div className="d-flex justify-content-end gap-2">
                    <button className="btn btn-danger" type="submit">Submit Review</button>
                    <button className="btn btn-secondary" type="button" onClick={onClose}>Back</button>
                  </div>
                </form>
              ) : (
                <p className="text-warning mt-2">Please log in to submit a review.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
