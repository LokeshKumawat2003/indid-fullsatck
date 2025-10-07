
const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // the student/user being interviewed
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost", // the job this interview is for
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    developerType: {
      type: String,
      required: true,
    },
    resume: {
      type: String, // PDF link
    },
    github: {
      type: String, // GitHub project link
    },
    files: [
      {
        name: { type: String },
        link: { type: String },
      },
    ],
    interviewTime: {
      type: Date,
      required: true,
    },
    meetLink: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Scheduled", "Cancelled", "Completed"],
      default: "Scheduled",
    },
    nextRound: {
      type: String,
      enum: ["Next Round", "Pass", "Reject", ""],
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin who scheduled
      required: true,
    },
  },
  { timestamps: true }
);

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;

