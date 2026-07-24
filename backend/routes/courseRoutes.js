const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getMyEnrollments,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getCourses);
router.get('/my-enrollments', protect, authorize('student'), getMyEnrollments);
router.get('/:id', getCourseById);
router.post('/', protect, authorize('teacher'), createCourse);
router.put('/:id', protect, authorize('teacher'), updateCourse);
router.delete('/:id', protect, authorize('teacher'), deleteCourse);
router.post('/:id/enroll', protect, authorize('student'), enrollCourse);

module.exports = router;