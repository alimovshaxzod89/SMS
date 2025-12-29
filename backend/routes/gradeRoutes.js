const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  createGrade,
  getAllGrades,
  getGrade,
  updateGrade,
  deleteGrade
} = require('../controllers/gradeController');
const { protect, authorize } = require('../middleware/auth');

// ✅ Grade-specific rate limiting
const gradeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 100,
  message: {
    success: false,
    error: 'Too many requests for grade operations, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Stricter rate limiting for create/update/delete
const gradeMutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    error: 'Too many modification requests, please try again later'
  }
});

// ✅ Apply rate limiting
router.use(gradeLimiter);

// ============================================
// PUBLIC ROUTES (Read-only for authenticated users)
// ============================================

/**
 * @route   GET /api/grades
 * @desc    Get all grades with pagination
 * @access  Private (All authenticated users can view grades)
 */
router.get(
  '/',
  protect,
  getAllGrades
);

/**
 * @route   GET /api/grades/:id
 * @desc    Get single grade by ID
 * @access  Private (All authenticated users)
 */
router.get(
  '/:id',
  protect,
  getGrade
);

// ============================================
// ADMIN-ONLY ROUTES
// ============================================

/**
 * @route   POST /api/grades
 * @desc    Create new grade
 * @access  Private (Admin only)
 */
router.post(
  '/',
  protect,
  authorize('admin'),
  gradeMutationLimiter,
  createGrade
);

/**
 * @route   PUT /api/grades/:id
 * @desc    Update grade information
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  protect,
  authorize('admin'),
  gradeMutationLimiter,
  updateGrade
);

/**
 * @route   DELETE /api/grades/:id
 * @desc    Delete grade
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  gradeMutationLimiter,
  deleteGrade
);

module.exports = router;

