const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  createTeacher,
  getAllTeachers,
  getTeacher,
  updateTeacher,
  deleteTeacher
} = require('../controllers/teacherController');
const { protect, authorize } = require('../middleware/auth');
const { validateTeacher, validateTeacherUpdate } = require('../middleware/validators/teacherValidator');

// ✅ Teacher-specific rate limiting
const teacherLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 50, // Har bir IP uchun 50 ta request
  message: {
    success: false,
    error: 'Too many requests for teacher operations, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Stricter rate limiting for create/update/delete
const teacherMutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: 'Too many modification requests, please try again later'
  }
});

// ✅ Apply rate limiting to all teacher routes
router.use(teacherLimiter);

// ============================================
// PROTECTED ROUTES - Authentication required
// ============================================

/**
 * @route   GET /api/teachers
 * @desc    Get all teachers with pagination and filtering
 * @access  Private (Admin, Teacher)
 */
router.get(
  '/',
  protect,
  authorize('admin', 'teacher'),
  getAllTeachers
);

/**
 * @route   POST /api/teachers
 * @desc    Create new teacher
 * @access  Private (Admin only)
 */
router.post(
  '/',
  protect,
  authorize('admin'),
  teacherMutationLimiter,
  validateTeacher,
  createTeacher
);

/**
 * @route   GET /api/teachers/:id
 * @desc    Get single teacher by ID
 * @access  Private (Admin, Teacher - own profile only, Student - can view their teachers)
 */
router.get(
  '/:id',
  protect,
  authorize('admin', 'teacher', 'student'),
  getTeacher
);

/**
 * @route   PUT /api/teachers/:id
 * @desc    Update teacher information
 * @access  Private (Admin, Teacher - own profile only)
 */
router.put(
  '/:id',
  protect,
  authorize('admin', 'teacher'),
  teacherMutationLimiter,
  validateTeacherUpdate,
  updateTeacher
);

/**
 * @route   DELETE /api/teachers/:id
 * @desc    Delete teacher
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  teacherMutationLimiter,
  deleteTeacher
);

module.exports = router;