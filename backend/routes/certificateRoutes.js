const express = require('express');
const router = express.Router();
const { claimCertificate, getMyCertificates, verifyCertificate } = require('../controllers/certificateController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/claim/:courseId', protect, authorize('student'), claimCertificate);
router.get('/my-certificates', protect, authorize('student'), getMyCertificates);
router.get('/verify/:code', verifyCertificate); // Public, no auth

module.exports = router;