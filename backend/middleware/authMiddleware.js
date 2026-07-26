const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Check karo if user is logged in (valid token)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Split header, keep only token
      token = req.headers.authorization.split(' ')[1];

      // Token verify 
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user form DB(without password) and attach with request
      req.user = await User.findById(decoded.id).select('-password');

      next(); // All ok, move ahead
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Check user has a specific role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };