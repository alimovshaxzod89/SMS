const express = require('express');
const router = express.Router();
const {
  createExam,
  getAllExams,
  getExam,
  updateExam,
  deleteExam
} = require('../controllers/examController');

// Authentication middleware import
const { protect, authorize } = require('../middleware/auth');

// Added to all routes that require authentication
router.route('/')
  .get(protect, authorize('admin', 'teacher', 'student', 'parent'), getAllExams)
  .post(protect, authorize('admin'), createExam);

router.route('/:id')
  .get(protect, authorize('admin', 'teacher', 'student', 'parent'), getExam)
  .put(protect, authorize('admin'), updateExam)
  .delete(protect, authorize('admin'), deleteExam);

module.exports = router;