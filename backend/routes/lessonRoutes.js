const express = require('express');
const router = express.Router();
const {
  createLesson,
  getAllLessons,
  getLesson,
  updateLesson,
  deleteLesson
} = require('../controllers/lessonController');

// ✅ Authentication middleware import
const { protect, authorize } = require('../middleware/auth');

// ✅ Barcha route'larga authentication qo'shish
router.route('/')
  .get(protect, authorize('admin', 'teacher'), getAllLessons)
  .post(protect, authorize('admin'), createLesson);

router.route('/:id')
  .get(protect, authorize('admin', 'teacher'), getLesson)
  .put(protect, authorize('admin'), updateLesson)
  .delete(protect, authorize('admin'), deleteLesson);

module.exports = router;