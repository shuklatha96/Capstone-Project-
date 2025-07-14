const jwt = require('jsonwebtoken');

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]; // Format: Bearer <token>
  if (!token) return res.status(401).json({ message: 'Unauthorized: Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user details to request
    req.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role || 'user' // default to 'user' if not set
    };

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
}

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized: Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    req.user = {
      id: decoded.id,
      name: decoded.name,
      role: decoded.role
    };

    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid Token' });
  }
}

module.exports = { isAuthenticated, isAdmin };
