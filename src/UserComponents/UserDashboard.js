// src/UserComponents/UserDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
import ReviewModal from '../Components/ReviewModal';
import { getReviews } from '../Components/reviewAPI';
import './UserDashboard.css'; // Import the new CSS file
import { renderStars as reviewModalRenderStars } from '../Components/ReviewModal'; // Import renderStars with an alias
import PreferencesModal from '../Components/PreferencesModal'; // Import the new PreferencesModal
import AvatarModal from '../Components/AvatarModal'; // Import the new AvatarModal

function UserDashboard({ user, setLoggedInUser }) {
  const [movies, setMovies] = useState([]);
  const [userReviews, setUserReviews] = useState({});
  const [selectedMovieToReview, setSelectedMovieToReview] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false); // New state for avatar modal

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchMovies();
    fetchUserReviews();
  }, [token]);

  const fetchMovies = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/movies');
      console.log("Movies fetched:", res.data);
      setMovies(res.data);
    } catch (error) {
      console.error('Failed to fetch movies', error);
    }
  };

  const fetchUserReviews = async () => {
    if (!token) return;

    try {
      const res = await axios.get('http://localhost:5000/api/reviews/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const reviewsByMovie = {};
      res.data.forEach((review) => {
        console.log("Review object from backend:", review);
        reviewsByMovie[review.mid] = review;
      });
      setUserReviews(reviewsByMovie);
    } catch (error) {
      console.error('Failed to fetch user reviews', error);
    }
  };

  const handleOpenReviewModal = (movie) => {
    setSelectedMovieToReview(movie);
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setSelectedMovieToReview(null);
    setShowReviewModal(false);
    fetchUserReviews();
  };

  // Function to handle saving preferences (will send to backend later)
  const handleSavePreferences = async (preferences) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No authentication token found.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          favoriteGenre: preferences.favoriteGenre,
          favoriteMovie: preferences.favoriteMovie,
          favoriteDirector: preferences.favoriteDirector,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await res.json();
      console.log('Profile updated successfully:', data.user);

      setLoggedInUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  // Function to handle saving avatar (will send to backend)
  const handleSaveAvatar = async (newAvatarUrl) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No authentication token found.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ avatarUrl: newAvatarUrl }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to update avatar');
      }

      const data = await res.json();
      console.log('Avatar updated successfully:', data.user);

      setLoggedInUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));

    } catch (error) {
      console.error('Error saving avatar:', error);
    }
  };

  return (
    <div className="container mt-4 user-dashboard-container">
      <div className="user-dashboard-header mb-5">
        {/* User Profile Section */}
        <div className="user-profile-section d-flex align-items-center mb-4">
          {/* Avatar */}
          <div className="user-avatar me-4">
            <img src={user?.avatarUrl || "/images/default-avatar.png"} alt="User Avatar" className="rounded-circle" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
          </div>
          
          {/* Welcome Message and Preferences */}
          <div className="user-info">
            <h2 className="welcome-message">Welcome, {user?.name || 'User'}!</h2>
            <div className="user-preferences d-flex align-items-center mt-2">
              <p className="favorite-genre mb-0">Favorite Genre: <span className="genre-value">{user?.favoriteGenre || 'Not Set'}</span></p>
              <button className="btn btn-outline-light btn-sm ms-3 edit-preferences-btn" onClick={() => setShowPreferencesModal(true)}>Edit Preferences</button>
            </div>
            <button className="btn btn-secondary btn-sm mt-3 change-avatar-btn" onClick={() => setShowAvatarModal(true)}>Change Avatar</button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content Header (Moved for better layout) */}
      <div className="main-dashboard-content-header text-center mb-4">
        <h2 className="dashboard-section-title">User Dashboard</h2>
        <p className="dashboard-intro-text">Click "Write Review" to add your review for any movie</p>
      </div>

      <h3>Available Movies</h3>
      <div className="row">
        {movies.map((movie) => (
          <div className="col-md-4 col-lg-3 mb-4" key={movie._id || movie.imdbID}>
            <div className="card h-100 user-movie-card">
              <div className="card-body d-flex flex-column">
                {movie.imageUrl && (
                  <img
                    src={movie.imageUrl}
                    alt={movie.name}
                    className="img-fluid rounded mb-2"
                    style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'contain' }}
                  />
                )}
                <h5 className="card-title">{movie.name}</h5>
                <h6 className="card-subtitle mb-2">
                  {movie.genre} • {movie.year}
                </h6>
                <p className="card-text">{movie.description}</p>

                {userReviews[movie._id || movie.imdbID] ? (
                  <div className="alert alert-success user-rating-section mt-auto">
                    {reviewModalRenderStars(userReviews[movie._id || movie.imdbID].score, false, null, null, null, null)} Your Rating
                    <br />
                    "{userReviews[movie._id || movie.imdbID].msg}"
                    <br />
                    Reviewed on {new Date(userReviews[movie._id || movie.imdbID].createdAt).toLocaleDateString()}
                  </div>
                ) : (
                  <button className="btn user-write-review-btn mt-auto" onClick={() => handleOpenReviewModal(movie)}>
                    Write Review
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mt-5">My Reviews</h3>
      <div className="row">
        {Object.keys(userReviews).length === 0 && <p className="text-muted">No reviews found.</p>}
        {movies.filter(movie => userReviews[movie._id || movie.imdbID]).map(movie => (
          <div className="col-md-4 col-lg-3 mb-4" key={movie._id || movie.imdbID}>
            <div className="card h-100 user-movie-card">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{movie.name}</h5>
                <div className="alert alert-success user-rating-section">
                  {reviewModalRenderStars(userReviews[movie._id || movie.imdbID].score, false, null, null, null, null)} Your Rating
                  <br />
                  "{userReviews[movie._id || movie.imdbID].msg}"
                  <br />
                  By: {userReviews[movie._id || movie.imdbID].uid.name || "You"} Reviewed on {new Date(userReviews[movie._id || movie.imdbID].createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showReviewModal && (
        <ReviewModal
          selectedMovie={selectedMovieToReview}
          show={showReviewModal}
          onClose={handleCloseReviewModal}
          user={user}
        />
      )}

      {/* Preferences Modal */}
      {showPreferencesModal && (
        <PreferencesModal
          show={showPreferencesModal}
          onClose={() => setShowPreferencesModal(false)}
          onSave={handleSavePreferences}
          currentGenre={user?.favoriteGenre}
          currentMovie={user?.favoriteMovie}
          currentDirector={user?.favoriteDirector}
          currentAvatarUrl={user?.avatarUrl}
          user={user} // Pass user prop to modal if needed for other info
        />
      )}

      {/* Avatar Modal */}
      {showAvatarModal && (
        <AvatarModal
          show={showAvatarModal}
          onClose={() => setShowAvatarModal(false)}
          onSave={handleSaveAvatar}
          currentAvatarUrl={user?.avatarUrl}
        />
      )}
    </div>
  );
}

export default UserDashboard;
