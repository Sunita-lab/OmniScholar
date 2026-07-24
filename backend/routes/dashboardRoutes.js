const express = require('express');
const router = express.Router();
const { getTeacherDashboard, getStudentDashboard } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/teacher', protect, authorize('teacher'), getTeacherDashboard);
router.get('/student', protect, authorize('student'), getStudentDashboard);

module.exports = router;