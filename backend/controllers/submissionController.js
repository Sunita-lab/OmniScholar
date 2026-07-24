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

// @desc    Grade a submission (Teacher only)
// @route   PUT /api/submissions/:id/grade
const gradeSubmission = async (req, res) => {
  try {
    const { marks, feedback } = req.body;

    const submission = await Submission.findById(req.params.id).populate('assignment');

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Check karo ki teacher hi is assignment ka creator hai
    if (submission.assignment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to grade this submission' });
    }

    // Marks maxMarks se zyada na ho
    if (marks > submission.assignment.maxMarks) {
      return res.status(400).json({
        message: `Marks cannot exceed maximum marks (${submission.assignment.maxMarks})`,
      });
    }

    submission.marks = marks;
    submission.feedback = feedback || '';
    submission.gradedBy = req.user._id;
    submission.status = 'graded';

    await submission.save();

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitAssignment,
  getSubmissionsByAssignment,
  getMySubmissions,
  gradeSubmission,
};