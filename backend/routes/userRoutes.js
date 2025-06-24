const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isAuthenticated } = require('../middleware/authMiddleware');

// Register
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Hardcoded list of authorized admin emails
  const authorizedAdminEmails = [
    'authorized_admin1@example.com',
    'authorized_admin2@example.com',
    'authorized_admin3@example.com',
  ];

  try {
    // If the role is 'admin', check if the email is in the authorized list
    if (role === 'admin' && !authorizedAdminEmails.includes(email)) {
      return res.status(403).json({ message: 'Unauthorized: Admin registration is restricted.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // Create new user with plain password — schema will hash it before save
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt for email:", email);
  console.log("Password received (plaintext, for debug only!):", password);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Login failed: User not found for email:", email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    console.log("User found:", user.email);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Login failed: Password mismatch for email:", email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    console.log("Password matched for email:", user.email);

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role, favoriteGenre: user.favoriteGenre, favoriteMovie: user.favoriteMovie, favoriteDirector: user.favoriteDirector, avatarUrl: user.avatarUrl } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Update user profile (preferences)
router.put('/profile', isAuthenticated, async (req, res) => {
  const { name, email, favoriteGenre, favoriteMovie, favoriteDirector, avatarUrl, password } = req.body;

  try {
    const user = await User.findById(req.user.id); // req.user.id comes from isAuthenticated middleware

    if (!user) {
      console.error('Profile update error: User not found for ID', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (favoriteGenre !== undefined) user.favoriteGenre = favoriteGenre;
    if (favoriteMovie !== undefined) user.favoriteMovie = favoriteMovie;
    if (favoriteDirector !== undefined) user.favoriteDirector = favoriteDirector; // Corrected field name
    // Allow setting avatarUrl to an empty string to remove it
    if (req.body.hasOwnProperty('avatarUrl')) user.avatarUrl = avatarUrl;

    // Handle password update if provided
    if (password) {
      user.password = password; // The pre-save hook in the user model will hash this
    }

    await user.save();
    // Send back the updated user data for frontend state management
    res.json({ message: 'Profile updated successfully', user: { id: user._id, name: user.name, email: user.email, role: user.role, favoriteGenre: user.favoriteGenre, favoriteMovie: user.favoriteMovie, favoriteDirector: user.favoriteDirector, avatarUrl: user.avatarUrl } });

  } catch (err) {
    console.error('Profile update error:', err);
    // Check for Mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.keys(err.errors).map(key => err.errors[key].message);
      return res.status(400).json({ message: errors.join(', ') });
    }
    // Check for duplicate key error (e.g., email already exists)
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already in use.' });
    }
    res.status(500).json({ message: 'Server error during profile update.' });
  }
});

module.exports = router;
