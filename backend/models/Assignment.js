
const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost", // The job this assignment is linked to
      required: true,
    },
    assignmentText: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin who created the assignment
      required: true,
    },
    assignedTo: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Only students who applied to this job
      },
    ],
    submissions: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        answerText: { type: String }, // could be notes/description
        deployedLink: { type: String }, // submitted project link
        submittedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;

