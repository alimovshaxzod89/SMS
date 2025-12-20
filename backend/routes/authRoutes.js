//routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validation');
const { protect } = require('../middleware/auth');
const {
  login,
  getMe,
  updatePassword,
  logout,
  logoutAll
} = require('../controllers/authController');

// Validation rules
const loginValidation = [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('role').isIn(['admin', 'teacher', 'student', 'parent'])
    .withMessage('Invalid role')
];

const updatePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters')
];

router.post('/login', loginValidation, validate, login);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePasswordValidation, validate, updatePassword);
router.post('/logout', protect, logout);
router.post('/logout-all', protect, logoutAll);

module.exports = router;