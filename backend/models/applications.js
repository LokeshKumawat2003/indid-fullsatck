const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
      required: true,
    },
    jobpostID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPost",
      required: true,
    },
    // optional admin/user who handled the application; reference the UserAccount model
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserAccount",
      required: false,
    },
  },
  { timestamps: true }
);

const ApplicationModel = mongoose.model("Application", applicationSchema);

module.exports = ApplicationModel;
