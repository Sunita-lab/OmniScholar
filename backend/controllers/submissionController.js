const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');

// @desc    Submit assignment (Student only)
// @route   POST /api/submissions/:assignmentId
const submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Check karo already submit to nahi kiya
    const existing = await Submission.findOne({
      student: req.user._id,
      assignment: assignment._id,
    });

    if (existing) {
      return res.status(400).json({ message: 'You have already submitted this assignment' });
    }

    // Late hai ya nahi check karo
    const isLate = new Date() > new Date(assignment.deadline);

    const submission = await Submission.create({
      student: req.user._id,
      assignment: assignment._id,
      files: req.body.files || [],
      textSubmission: req.body.textSubmission || '',
      status: isLate ? 'late' : 'submitted',
    });

    res.status(201).json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all submissions for an assignment (Teacher only)
// @route   GET /api/submissions/assignment/:assignmentId
const getSubmissionsByAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view these submissions' });
    }

    const submissions = await Submission.find({ assignment: assignment._id }).populate(
      'student',
      'fullName email avatar'
    );

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in student's own submissions
// @route   GET /api/submissions/my-submissions
const getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user._id }).populate({
      path: 'assignment',
      select: 'title deadline maxMarks course',
    });

    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitAssignment,
  getSubmissionsByAssignment,
  getMySubmissions,
};