// src/Admin/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./AdminDashboard.css";
import { FaTrash, FaUserShield, FaEdit } from "react-icons/fa";
import { renderStars } from '../Components/ReviewModal';

const AdminDashboard = ({ user }) => {
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newMovie, setNewMovie] = useState({
    name: "",
    cast: "",
    genre: "",
    duration: "",
    year: "",
    description: "",
    imageUrl: "",
    type: "Popular Movies",
  });
  const [showAddMovie, setShowAddMovie] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [showDeleteMovieId, setShowDeleteMovieId] = useState(null);
  const [showDeleteReviewId, setShowDeleteReviewId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [showEditMovie, setShowEditMovie] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  // Fetch movies
  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/movies", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMovies(data);
    } catch (error) {
      setNotification({ show: true, message: "Error fetching movies", type: "error" });
    }
    setLoading(false);
  };

  // Fetch all reviews
  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReviews(data);
    } catch (error) {
      setNotification({ show: true, message: "Error fetching reviews", type: "error" });
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchReviews();
    // eslint-disable-next-line
  }, []);

  // Add Movie
  const handleAddMovie = async () => {
    const { name, cast, genre, duration, year, description, imageUrl, type } = newMovie;
    console.log("AdminDashboard: Attempting to add movie with data:", newMovie);
    if (!name || !cast || !genre || !duration || !year || !description || !imageUrl || !type) {
      setNotification({ show: true, message: "Please fill in all required fields", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newMovie),
      });
      if (!res.ok) throw new Error("Failed to add movie");
      setNotification({ show: true, message: "Movie added successfully", type: "success" });
      setShowAddMovie(false);
      setNewMovie({ name: "", cast: "", genre: "", duration: "", year: "", description: "", imageUrl: "", type: "Popular Movies" });
      fetchMovies();
    } catch (error) {
      setNotification({ show: true, message: error.message, type: "error" });
    }
    setLoading(false);
  };

  // Update Movie
  const handleUpdateMovie = async () => {
    if (!editingMovie) return;
    const { _id, name, cast, genre, duration, year, description, imageUrl, type } = editingMovie;
    if (!name || !cast || !genre || !duration || !year || !description || !imageUrl || !type) {
      setNotification({ show: true, message: "Please fill in all required fields for update", type: "error" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/movies/${_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingMovie),
      });
      if (!res.ok) throw new Error("Failed to update movie");
      setNotification({ show: true, message: "Movie updated successfully", type: "success" });
      setShowEditMovie(false);
      setEditingMovie(null);
      fetchMovies();
    } catch (error) {
      setNotification({ show: true, message: error.message, type: "error" });
    }
    setLoading(false);
  };

  // Handle edit click
  const handleEditClick = (movie) => {
    setEditingMovie({ ...movie });
    setShowEditMovie(true);
  };

  // Delete Movie
  const handleDeleteMovie = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/movies/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete movie");
      setNotification({ show: true, message: "Movie deleted", type: "success" });
      fetchMovies();
    } catch (error) {
      setNotification({ show: true, message: error.message, type: "error" });
    }
    setShowDeleteMovieId(null);
    setLoading(false);
  };

  // Delete Review
  const handleDeleteReview = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete review");
      setNotification({ show: true, message: "Review deleted", type: "success" });
      fetchReviews();
    } catch (error) {
      setNotification({ show: true, message: error.message, type: "error" });
    }
    setShowDeleteReviewId(null);
    setLoading(false);
  };

  // Count reviews for a movie
  const getReviewCount = (movieId) => reviews.filter((r) => r.mid === movieId).length;

  return (
    <div className="admin-dashboard">
      {/* Top Bar */}
      <div className="admin-topbar d-flex align-items-center justify-content-between">
        <div className="admin-app-title">
          <FaUserShield style={{ color: '#e50914', marginLeft: 8 }} />
        </div>
        <div className="admin-tabs">
          <span className="active">Admin Dashboard</span>
          <span style={{ color: '#aaa', cursor: 'pointer' }} onClick={() => navigate('/user-dashboard')}>User Dashboard</span>
        </div>
        <div className="admin-user-info">
          <span>{user?.name || "Admin"}</span>
          <button className="switch-user-btn" onClick={() => navigate('/user-dashboard')}>Switch to User</button>
        </div>
      </div>

      <div className="container py-4">
        {/* Notification */}
        {notification.show && (
          <div className={`alert alert-${notification.type === 'error' ? 'danger' : 'success'} mb-4`}>
            {notification.message}
          </div>
        )}

        {/* Movie Management */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Movie Management</h3>
          <button className="add-movie-btn" onClick={() => setShowAddMovie(true)}>+ Add Movie</button>
        </div>
        <div className="table-responsive">
          <table className="table movie-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Genre</th>
                <th>Year</th>
                <th>Reviews</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie._id}>
                  <td>
                    <strong>{movie.name}</strong>
                    <div className="text-muted small">{movie.description}</div>
                  </td>
                  <td>{movie.genre}</td>
                  <td>{movie.year}</td>
                  <td>{getReviewCount(movie._id)}</td>
                  <td>
                    <span className="edit-icon me-2" title="Edit Movie" onClick={() => handleEditClick(movie)}><FaEdit /></span>
                    <span className="delete-icon" title="Delete Movie" onClick={() => setShowDeleteMovieId(movie._id)}><FaTrash /></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Movie Modal */}
        {showAddMovie && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.7)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Movie</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowAddMovie(false)}></button>
                </div>
                <div className="modal-body">
                  <label className="form-label">Title *</label>
                  <input className="form-control mb-2" name="name" placeholder="Enter movie title" value={newMovie.name} onChange={e => setNewMovie({ ...newMovie, name: e.target.value })} />
                  <label className="form-label">Cast *</label>
                  <input className="form-control mb-2" name="cast" placeholder="Enter cast names (comma separated)" value={newMovie.cast} onChange={e => setNewMovie({ ...newMovie, cast: e.target.value })} />
                  <label className="form-label">Genre *</label>
                  <select className="form-control mb-2" name="genre" value={newMovie.genre} onChange={e => setNewMovie({ ...newMovie, genre: e.target.value })}>
                    <option value="">Select genre</option>
                    <option value="Action">Action</option>
                    <option value="Drama">Drama</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Romance">Romance</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Horror">Horror</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Animation">Animation</option>
                    <option value="Crime">Crime</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Biography">Biography</option>
                  </select>
                  <label className="form-label">Year *</label>
                  <input className="form-control mb-2" name="year" placeholder="2024" value={newMovie.year} onChange={e => setNewMovie({ ...newMovie, year: e.target.value })} />
                  <label className="form-label">Duration *</label>
                  <input className="form-control mb-2" name="duration" placeholder="e.g., 2h 30m" value={newMovie.duration} onChange={e => setNewMovie({ ...newMovie, duration: e.target.value })} />
                  <label className="form-label">Description</label>
                  <textarea className="form-control mb-2" name="description" placeholder="Brief description of the movie" value={newMovie.description} onChange={e => setNewMovie({ ...newMovie, description: e.target.value })} />
                  <label className="form-label mt-2">Image URL *</label>
                  <input className="form-control mb-2" name="imageUrl" placeholder="Enter image URL (e.g., https://example.com/poster.jpg)" value={newMovie.imageUrl} onChange={e => setNewMovie({ ...newMovie, imageUrl: e.target.value })} />
                  <label className="form-label">Type *</label>
                  <select className="form-control mb-2" name="type" value={newMovie.type} onChange={e => setNewMovie({ ...newMovie, type: e.target.value })}>
                    <option value="Popular Movies">Popular Movies</option>
                    <option value="Trending This Week">Trending This Week</option>
                    <option value="Top Rated">Top Rated</option>
                    <option value="TV Shows">TV Shows</option>
                    <option value="Web Series">Web Series</option>
                  </select>
                </div>
                <div className="modal-footer p-0 border-0" style={{ background: "none" }}>
                  <div className="d-flex w-100 gap-2">
                    <button className="btn btn-primary w-50" onClick={handleAddMovie} disabled={loading}>Add Movie</button>
                    <button className="btn btn-secondary w-50" onClick={() => setShowAddMovie(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Movie Modal */}
        {showEditMovie && editingMovie && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.7)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Movie</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => { setShowEditMovie(false); setEditingMovie(null); }}></button>
                </div>
                <div className="modal-body">
                  <label className="form-label">Title *</label>
                  <input className="form-control mb-2" name="name" value={editingMovie.name} onChange={e => setEditingMovie({ ...editingMovie, name: e.target.value })} />
                  <label className="form-label">Cast *</label>
                  <input className="form-control mb-2" name="cast" value={editingMovie.cast} onChange={e => setEditingMovie({ ...editingMovie, cast: e.target.value })} />
                  <label className="form-label">Genre *</label>
                  <select className="form-control mb-2" name="genre" value={editingMovie.genre} onChange={e => setEditingMovie({ ...editingMovie, genre: e.target.value })}>
                    <option value="Action">Action</option>
                    <option value="Drama">Drama</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Thriller">Thriller</option>
                    <option value="Romance">Romance</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                    <option value="Horror">Horror</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Animation">Animation</option>
                    <option value="Crime">Crime</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Mystery">Mystery</option>
                    <option value="Biography">Biography</option>
                  </select>
                  <label className="form-label">Year *</label>
                  <input className="form-control mb-2" name="year" value={editingMovie.year} onChange={e => setEditingMovie({ ...editingMovie, year: e.target.value })} />
                  <label className="form-label">Duration *</label>
                  <input className="form-control mb-2" name="duration" value={editingMovie.duration} onChange={e => setEditingMovie({ ...editingMovie, duration: e.target.value })} />
                  <label className="form-label">Description</label>
                  <textarea className="form-control mb-2" name="description" value={editingMovie.description} onChange={e => setEditingMovie({ ...editingMovie, description: e.target.value })} />
                  <label className="form-label mt-2">Image URL *</label>
                  <input className="form-control mb-2" name="imageUrl" value={editingMovie.imageUrl} onChange={e => setEditingMovie({ ...editingMovie, imageUrl: e.target.value })} />
                  <label className="form-label">Type *</label>
                  <select className="form-control mb-2" name="type" value={editingMovie.type} onChange={e => setEditingMovie({ ...editingMovie, type: e.target.value })}>
                    <option value="Popular Movies">Popular Movies</option>
                    <option value="Trending This Week">Trending This Week</option>
                    <option value="Top Rated">Top Rated</option>
                    <option value="TV Shows">TV Shows</option>
                    <option value="Web Series">Web Series</option>
                  </select>
                </div>
                <div className="modal-footer p-0 border-0" style={{ background: "none" }}>
                  <div className="d-flex w-100 gap-2">
                    <button className="btn btn-primary w-50" onClick={handleUpdateMovie} disabled={loading}>Update Movie</button>
                    <button className="btn btn-secondary w-50" onClick={() => { setShowEditMovie(false); setEditingMovie(null); }}>Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Movie Confirmation Modal */}
        {showDeleteMovieId && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.7)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete this movie?
                </div>
                <div className="modal-footer">
                  <button className="btn btn-danger" onClick={() => handleDeleteMovie(showDeleteMovieId)} disabled={loading}>Delete</button>
                  <button className="btn btn-secondary" onClick={() => setShowDeleteMovieId(null)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review Management */}
        <h3 className="mt-5 mb-3">Review Management</h3>
        <div className="row">
          {reviews.length === 0 && <p className="text-muted">No reviews found.</p>}
          {reviews.map((review) => (
            <div className="col-md-6 col-lg-4" key={review._id}>
              <div className="review-card mb-3">
                <div className="d-flex align-items-center mb-2">
                  <strong>{movies.find(m => m._id === review.mid)?.name || "Movie"}</strong>
                  {renderStars(review.score, false)}
                </div>
                <div className="mb-2">"{review.msg}"</div>
                <div className="review-author">
                  By: {review?.uid?.name || "Unknown User"} 
                  <span className="review-date">
                    Date: {review.createdAt && !isNaN(new Date(review.createdAt)) ? new Date(review.createdAt).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit'
                    }).replace(/\//g, '/') : "-"}
                  </span>
                </div>
                <span className="delete-icon" title="Delete Review" onClick={() => setShowDeleteReviewId(review._id)}><FaTrash /></span>
              </div>
            </div>
          ))}
        </div>

        {/* Delete Review Confirmation Modal */}
        {showDeleteReviewId && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.7)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                </div>
                <div className="modal-body">
                  Are you sure you want to delete this review?
                </div>
                <div className="modal-footer">
                  <button className="btn btn-danger" onClick={() => handleDeleteReview(showDeleteReviewId)} disabled={loading}>Delete</button>
                  <button className="btn btn-secondary" onClick={() => setShowDeleteReviewId(null)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
