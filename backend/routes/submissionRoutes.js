const express = require('express');
const router = express.Router();
const {
  submitAssignment,
  getSubmissionsByAssignment,
  getMySubmissions,
  gradeSubmission,
} = require('../controllers/submissionController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/:assignmentId', protect, authorize('student'), submitAssignment);
router.get('/my-submissions', protect, authorize('student'), getMySubmissions);
router.put('/:id/grade', protect, authorize('teacher'), gradeSubmission);
router.get('/assignment/:assignmentId', protect, authorize('teacher'), getSubmissionsByAssignment);

module.exports = router;