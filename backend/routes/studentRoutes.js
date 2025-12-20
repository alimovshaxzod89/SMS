const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const {
  createStudent,
  getAllStudents,
  getStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const { validateStudent, validateStudentUpdate } = require('../middleware/validators/studentValidator');

// ✅ Student-specific rate limiting
const studentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 daqiqa
  max: 50, // Har bir IP uchun 50 ta request
  message: {
    success: false,
    error: 'Too many requests for student operations, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ✅ Stricter rate limiting for create/update/delete
const studentMutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: 'Too many modification requests, please try again later'
  }
});

// ✅ Apply rate limiting to all student routes
router.use(studentLimiter);

// ============================================
// PUBLIC ROUTES (Agar kerak bo'lsa)
// ============================================
// Hozircha yo'q, barcha route'lar protected

// ============================================
// PROTECTED ROUTES - Authentication required
// ============================================

/**
 * @route   GET /api/students
 * @desc    Get all students with pagination and filtering
 * @access  Private (Admin, Teacher)
 */
router.get(
  '/',
  protect,
  authorize('admin', 'teacher'),
  getAllStudents
);

/**
 * @route   POST /api/students
 * @desc    Create new student
 * @access  Private (Admin only)
 */
router.post(
  '/',
  protect,
  authorize('admin'),
  studentMutationLimiter,
  validateStudent,
  createStudent
);

/**
 * @route   GET /api/students/:id
 * @desc    Get single student by ID
 * @access  Private (Admin, Teacher, Student - own profile only)
 */
router.get(
  '/:id',
  protect,
  authorize('admin', 'teacher', 'student'),
  getStudent
);

/**
 * @route   PUT /api/students/:id
 * @desc    Update student information
 * @access  Private (Admin, Student - own profile only)
 */
router.put(
  '/:id',
  protect,
  authorize('admin', 'student'),
  studentMutationLimiter,
  validateStudentUpdate,
  updateStudent
);

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete student
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  studentMutationLimiter,
  deleteStudent
);

module.exports = router;