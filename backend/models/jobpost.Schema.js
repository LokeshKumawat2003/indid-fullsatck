
const mongoose = require("mongoose");

const jobpostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: "Not specified",
      required: true,
    },
    salary: {
      type: String,
      default: "Not disclosed",
      required: true,
    },
    workMode: {
      type: String,
      enum: ["On-site", "Remote", "Hybrid"],
      default: "On-site",
      required: true,
    },
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    education: {
      type: String,
      required: true,
    },
    openings: {
      type: Number,
      default: 1,
      min: 1,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
      required: true,
    },
    benefits: {
      type: String,
      required: true,
    },
    aiInterview: {
      type: Boolean,
      default: false,
      required: true,
    },
    easyApply: {
      type: Boolean,
      default: false,
      
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const JobPost = mongoose.model("JobPost", jobpostSchema);
module.exports = JobPost;

