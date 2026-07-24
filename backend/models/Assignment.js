const mongoose = require('mongoose');

const rubricItemSchema = new mongoose.Schema({
  criterion: { type: String, required: true },
  maxPoints: { type: Number, required: true },
});

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attachments: [
      {
        title: { type: String, required: true },
        fileUrl: { type: String, required: true },
      },
    ],
    deadline: {
      type: Date,
      required: [true, 'Please add a deadline'],
    },
    maxMarks: {
      type: Number,
      required: [true, 'Please add max marks'],
    },
    submissionType: {
      type: String,
      enum: ['file', 'text', 'both'],
      default: 'file',
    },
    rubric: [rubricItemSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Assignment', assignmentSchema);