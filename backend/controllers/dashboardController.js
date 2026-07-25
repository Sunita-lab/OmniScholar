const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

// @desc    Get teacher dashboard stats
// @route   GET /api/dashboard/teacher
const getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user._id;

    // Is teacher ke saare courses
    const courses = await Course.find({ instructor: teacherId });
    const courseIds = courses.map((c) => c._id);

    // Total students enrolled (in teacher's courses)
    const totalStudents = await Enrollment.countDocuments({
      course: { $in: courseIds },
    });

    // Total assignments created by this teacher
    const totalAssignments = await Assignment.countDocuments({
      createdBy: teacherId,
    });

    // Assignment IDs of this teacher (recent submissions ke liye chahiye)
    const assignments = await Assignment.find({ createdBy: teacherId }).select('_id');
    const assignmentIds = assignments.map((a) => a._id);

    // Recent submissions queue (ungraded, latest first)
    const recentSubmissions = await Submission.find({
      assignment: { $in: assignmentIds },
      status: { $ne: 'graded' },
    })
      .populate('student', 'fullName email avatar')
      .populate('assignment', 'title maxMarks')
      .sort({ submittedAt: -1 })
      .limit(10);

    res.json({
      totalCourses: courses.length,
      totalStudents,
      totalAssignments,
      recentSubmissions,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student dashboard stats
// @route   GET /api/dashboard/student
const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Enrolled courses
    const enrollments = await Enrollment.find({ student: studentId }).populate(
      'course',
      'title thumbnail instructor'
    );
    const courseIds = enrollments.map((e) => e.course._id);

    // Sab assignments jo student ke enrolled courses ke hain
    const allAssignments = await Assignment.find({ course: { $in: courseIds } });
    const allAssignmentIds = allAssignments.map((a) => a._id);

    // Student ki saari submissions
    const mySubmissions = await Submission.find({
      student: studentId,
      assignment: { $in: allAssignmentIds },
    });

    const submittedAssignmentIds = mySubmissions.map((s) => s.assignment.toString());

    // Pending = jo assignments hain lekin submit nahi kiye
    const pendingAssignments = allAssignments.filter(
      (a) => !submittedAssignmentIds.includes(a._id.toString())
    );

    // Grade overview (sirf graded submissions)
    const gradedSubmissions = mySubmissions.filter((s) => s.status === 'graded');

    // Pending assignments with deadline info (priority ke liye)
const pendingWithDeadline = pendingAssignments
  .map((a) => ({
    _id: a._id,
    title: a.title,
    deadline: a.deadline,
  }))
  .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
  .slice(0, 5);

// Recent activity (submissions, latest first)
const recentActivity = mySubmissions
  .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
  .slice(0, 5);

res.json({
  enrolledCoursesCount: enrollments.length,
  pendingAssignmentsCount: pendingAssignments.length,
  submittedAssignmentsCount: mySubmissions.length,
  pendingAssignments: pendingWithDeadline,
  recentActivity,
  gradeOverview: gradedSubmissions.map((s) => ({
    assignment: s.assignment,
    marks: s.marks,
    feedback: s.feedback,
  })),
});

    res.json({
      enrolledCoursesCount: enrollments.length,
      pendingAssignmentsCount: pendingAssignments.length,
      submittedAssignmentsCount: mySubmissions.length,
      gradeOverview: gradedSubmissions.map((s) => ({
        assignment: s.assignment,
        marks: s.marks,
        feedback: s.feedback,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTeacherDashboard, getStudentDashboard };