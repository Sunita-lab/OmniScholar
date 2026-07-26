const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

// @desc    Create a new course (Teacher only)
// @route   POST /api/courses
const createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      ...req.body,
      instructor: req.user._id, // logged-in teacher will be the instructor
    });

    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get all courses (with search, filters, pagination)
// @route   GET /api/courses
const getCourses = async (req, res) => {
  try {
    const { search, category, difficulty, sort, page = 1, limit = 10 } = req.query;

    // Query object 
    const query = { status: 'published' };

    // Keyword search (title mein search karega)
    if (search) {
      query.title = { $regex: search, $options: 'i' }; // 'i' = case-insensitive
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Difficulty filter
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default: newest first
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'title-asc') sortOption = { title: 1 };
    if (sort === 'title-desc') sortOption = { title: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };

    // Pagination calculation
    const skip = (Number(page) - 1) * Number(limit);

    const courses = await Course.find(query)
      .populate('instructor', 'fullName email avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const totalCourses = await Course.countDocuments(query);

    res.json({
      courses,
      currentPage: Number(page),
      totalPages: Math.ceil(totalCourses / Number(limit)),
      totalCourses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'instructor',
      'fullName email avatar'
    );

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update course (Instructor only)
// @route   PUT /api/courses/:id
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check karo ki yehi teacher is course ka instructor hai
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this course' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // updated document return 
      runValidators: true, // schema validations, check again
    });

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete course (Instructor only)
// @route   DELETE /api/courses/:id
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await course.deleteOne();

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Enroll in a course (Student only)
// @route   POST /api/courses/:id/enroll
const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Duplicate enrollment check 
    const alreadyEnrolled = await Enrollment.findOne({
      student: req.user._id,
      course: course._id,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: course._id,
    });

    // totalStudents count badhao
    course.totalStudents += 1;
    await course.save();

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in student's enrolled courses
// @route   GET /api/courses/my-enrollments
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ student: req.user._id }).populate({
      path: 'course',
      populate: { path: 'instructor', select: 'fullName email avatar' },
    });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getMyEnrollments,
};