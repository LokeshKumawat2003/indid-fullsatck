
const mongoose = require("mongoose");

const finalRoundSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // candidate reference
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost", // job reference
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    developerType: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
    },
    github: {
      type: String,
    },
    files: [
      {
        name: { type: String },
        link: { type: String },
      },
    ],
    status: {
      type: String,
      enum: ["Scheduled", "Cancelled"],
      default: "Scheduled",
    },
    finalStatus: {
      type: String,
      enum: ["Pass", "Fail", "Hold", ""],
      default: "",
    },
    offerMessage: {
      type: String, // job offer text if candidate passed
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // admin/HR who created this record
      required: true,
    },
  },
  { timestamps: true }
);

const FinalRound = mongoose.model("FinalRound", finalRoundSchema);

module.exports = FinalRound;

