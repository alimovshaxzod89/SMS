const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createClass,
  getAllClasses,
  getClass,
  updateClass,
  deleteClass
} = require('../controllers/classController');

// ✅ Protect va authorize middleware'larni to'g'ri tartibda qo'llash
router.route('/')
  .get(protect, authorize('admin', 'teacher'), getAllClasses)
  .post(protect, authorize('admin'), createClass);

router.route('/:id')
  .get(protect, authorize('admin', 'teacher'), getClass)
  .put(protect, authorize('admin'), updateClass)
  .delete(protect, authorize('admin'), deleteClass);

module.exports = router;