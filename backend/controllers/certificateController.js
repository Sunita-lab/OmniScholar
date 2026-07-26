const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Enrollment = require('../models/Enrollment');

// @desc    Check eligibility & issue certificate if all assignments graded
// @route   POST /api/certificates/claim/:courseId
const claimCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    // Check enrollment
    const enrolled = await Enrollment.findOne({ student: studentId, course: courseId });
    if (!enrolled) {
      return res.status(403).json({ message: 'You are not enrolled in this course' });
    }

    // Already has certificate?
    const existing = await Certificate.findOne({ student: studentId, course: courseId });
    if (existing) {
      return res.json(existing);
    }

    // Get all assignments for this course
    const assignments = await Assignment.find({ course: courseId });

    if (assignments.length === 0) {
      return res.status(400).json({ message: 'This course has no assignments yet' });
    }

    // Get student's submissions for these assignments
    const assignmentIds = assignments.map((a) => a._id);
    const submissions = await Submission.find({
      student: studentId,
      assignment: { $in: assignmentIds },
    });

    // Eligibility: every assignment must have a graded submission
    const allGraded =
      assignments.length === submissions.length &&
      submissions.every((s) => s.status === 'graded');

    if (!allGraded) {
      return res.status(400).json({
        message: 'Complete and get graded on all assignments to earn your certificate',
      });
    }

    const certificate = await Certificate.create({ student: studentId, course: courseId });
    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in student's certificates
// @route   GET /api/certificates/my-certificates
const getMyCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({ student: req.user._id })
      .populate('course', 'title category difficulty')
      .sort({ issuedAt: -1 });
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Public verification by code (no auth required)
// @route   GET /api/certificates/verify/:code
const verifyCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ verificationCode: req.params.code })
      .populate('student', 'fullName')
      .populate('course', 'title category difficulty estimatedHours');

    if (!certificate) {
      return res.status(404).json({ message: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { claimCertificate, getMyCertificates, verifyCertificate };