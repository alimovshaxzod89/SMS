const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  createSubject,
  getAllSubjects,
  getSubject,
  updateSubject,
  deleteSubject
} = require('../controllers/subjectController');
const { protect, authorize } = require('../middleware/auth');
const { validateSubject, validateSubjectUpdate } = require('../middleware/validators/subjectValidator');

// ✅ Subject-specific rate limiting
const subjectLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 100, // Read operations ko'proq ruxsat
  message: {
    success: false,
    error: 'Too many requests for subject operations, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Stricter rate limiting for create/update/delete
const subjectMutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    error: 'Too many modification requests, please try again later'
  }
});

// ✅ Apply rate limiting
router.use(subjectLimiter);

// ============================================
// PUBLIC ROUTES (Read-only for authenticated users)
// ============================================

/**
 * @route   GET /api/subjects
 * @desc    Get all subjects with pagination and filtering
 * @access  Private (All authenticated users can view subjects)
 */
router.get(
  '/',
  protect,
  getAllSubjects
);

/**
 * @route   GET /api/subjects/:id
 * @desc    Get single subject by ID
 * @access  Private (All authenticated users)
 */
router.get(
  '/:id',
  protect,
  getSubject
);

// ============================================
// ADMIN-ONLY ROUTES
// ============================================

/**
 * @route   POST /api/subjects
 * @desc    Create new subject
 * @access  Private (Admin only)
 */
router.post(
  '/',
  protect,
  authorize('admin'),
  subjectMutationLimiter,
  validateSubject,
  createSubject
);

/**
 * @route   PUT /api/subjects/:id
 * @desc    Update subject information
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  protect,
  authorize('admin'),
  subjectMutationLimiter,
  validateSubjectUpdate,
  updateSubject
);

/**
 * @route   DELETE /api/subjects/:id
 * @desc    Delete subject
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  subjectMutationLimiter,
  deleteSubject
);

module.exports = router;