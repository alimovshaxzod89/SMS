const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');
const Student = require('../models/Student');
const Parent = require('../models/Parent');
const TokenBlacklist = require('../models/TokenBlacklist');

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    try {
      // Check if token is blacklisted
      const blacklistedToken = await TokenBlacklist.findOne({ token });
      
      if (blacklistedToken) {
        return res.status(401).json({
          success: false,
          error: 'Token has been invalidated. Please login again.'
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user based on role
      let user;
      switch (decoded.role) {
        case 'teacher':
          user = await Teacher.findById(decoded.id);
          break;
        case 'student':
          user = await Student.findById(decoded.id);
          break;
        case 'parent':
          user = await Parent.findById(decoded.id);
          break;
        case 'admin':
          user = { _id: 'admin', role: 'admin' };
          break;
        default:
          return res.status(401).json({
            success: false,
            error: 'Invalid role in token'
          });
      }

      if (!user && decoded.role !== 'admin') {
        return res.status(401).json({
          success: false,
          error: 'User no longer exists'
        });
      }

      req.user = { ...user._doc, role: decoded.role };
      next();
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};