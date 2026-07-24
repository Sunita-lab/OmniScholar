const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Check karo ki user logged in hai (valid token hai)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Header aisa hota hai: "Bearer eyJhbGci..."
      token = req.headers.authorization.split(' ')[1];

      // Token verify karo
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // User ko database se le aao (password ke bina) aur request mein attach karo
      req.user = await User.findById(decoded.id).select('-password');

      next(); // sab theek hai, aage badho
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Check karo ki user ke paas specific role hai
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