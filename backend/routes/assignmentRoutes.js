const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getAssignmentsByCourse,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('teacher'), createAssignment);
router.get('/course/:courseId', protect, getAssignmentsByCourse);
router.get('/:id', protect, getAssignmentById);
router.put('/:id', protect, authorize('teacher'), updateAssignment);
router.delete('/:id', protect, authorize('teacher'), deleteAssignment);

module.exports = router;