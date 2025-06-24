import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminLogin.css';

const AdminLogin = ({ setLoggedInUser }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === '' || password === '' || (isRegistering && name === '')) {
      setError('❌ Please fill in all fields.');
      return;
    }

    const userData = { name, email, password, role: 'admin' };

    try {
      const endpoint = isRegistering ? '/api/users/register' : '/api/users/login';
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (!isRegistering) {
        // On login, save token and user info
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setLoggedInUser(data.user);
        navigate('/admin-dashboard');
      } else {
        // After registration, redirect to login page (or auto-login if you prefer)
        setError('✅ Registration successful. Please log in.');
        setIsRegistering(false);
        setName('');
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h3 className="login-heading">{isRegistering ? 'Admin Register' : 'Admin Login'}</h3>
        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <div className="input-group">
              <label className="input-label">Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              type="email"
              className="input-field"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p style={{ color: error.startsWith('✅') ? 'green' : 'red', marginTop: '10px' }}>{error}</p>}
          <button type="submit" className="btn btn-primary btn-block">
            {isRegistering ? 'Register' : 'Login'}
          </button>
        </form>
        <p style={{ marginTop: '15px' }}>
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
          >
            {isRegistering ? 'Login' : 'Register'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
