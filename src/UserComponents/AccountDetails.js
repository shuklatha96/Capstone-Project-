import React, { useState, useEffect } from 'react';
import './AccountDetails.css'; // Import the dedicated CSS file for AccountDetails
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const AccountDetails = ({ user, setLoggedInUser }) => {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState(''); // Never display actual password
  const [showPassword, setShowPassword] = useState(false);
  const [favoriteGenre, setFavoriteGenre] = useState(user?.favoriteGenre || '');
  const [favoriteMovie, setFavoriteMovie] = useState(user?.favoriteMovie || '');
  const [favoriteDirector, setFavoriteDirector] = useState(user?.favoriteDirector || '');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setFavoriteGenre(user.favoriteGenre || '');
      setFavoriteMovie(user.favoriteMovie || '');
      setFavoriteDirector(user.favoriteDirector || '');
    }
  }, [user]);

  if (!user) {
    return <p>Please log in to view account details.</p>;
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    const token = localStorage.getItem('authToken');
    if (!token) {
      setMessage('Error: No authentication token found.');
      setMessageType('error');
      return;
    }

    try {
      const updatedData = {
        name,
        email,
        favoriteGenre,
        favoriteMovie,
        favoriteDirector,
      };

      if (password) {
        updatedData.password = password; // Only send password if user wants to change it
      }

      const res = await axios.put('http://localhost:5000/api/users/profile', updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setLoggedInUser(res.data.user); // Update global user state
      localStorage.setItem('user', JSON.stringify(res.data.user)); // Update localStorage
      setPassword(''); // Clear password field after successful update
      setMessage('Profile updated successfully!');
      setMessageType('success');

    } catch (error) {
      console.error('Error updating profile:', error.response?.data?.message || error.message);
      setMessage(`Error: ${error.response?.data?.message || 'Failed to update profile.'}`);
      setMessageType('error');
    }
  };

  return (
    <div className="account-details-container">
      <div className="account-details-form">
        <h3 className="account-heading">Welcome, {user.name || user.email}!</h3>

        <form onSubmit={handleSave}>
          <div className="input-group">
            <label className="input-label">Name</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group password-group">
            <label className="input-label">New Password (leave blank to keep current)</label>
            <input
              type={showPassword ? "text" : "password"}
              className="input-field"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </span>
          </div>

          <div className="input-group">
            <label className="input-label">Favorite Genre</label>
            <select
              className="input-field"
              value={favoriteGenre}
              onChange={(e) => setFavoriteGenre(e.target.value)}
            >
              <option value="">Select a genre</option>
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
          </div>

          <div className="input-group">
            <label className="input-label">Favorite Movie</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Eega"
              value={favoriteMovie}
              onChange={(e) => setFavoriteMovie(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Favorite Director</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., S.S. Rajamouli"
              value={favoriteDirector}
              onChange={(e) => setFavoriteDirector(e.target.value)}
            />
          </div>

          {message && (
            <p className={`message ${messageType === 'success' ? 'text-success' : 'text-danger'}`}>
              {message}
            </p>
          )}

          <button type="submit" className="btn btn-danger btn-block">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountDetails;
