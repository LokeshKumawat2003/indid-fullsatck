const Application = require("../models/applications");
const mongoose = require("mongoose");

// Aggregation-based Applications controller

// Create a new application
async function createApplication(req, res) {
  try {
    const { userAccount, jobpostID, adminId } = req.body;
    if (!userAccount || !jobpostID) {
      return res
        .status(400)
        .json({
          success: false,
          message: "userAccount and jobpostID are required",
        });
    }

    // Validate object id formats early to avoid Mongoose cast errors
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(userAccount)) {
      return res.status(400).json({ success: false, message: "Invalid userAccount id" });
    }
    if (!mongoose.Types.ObjectId.isValid(jobpostID)) {
      return res.status(400).json({ success: false, message: "Invalid jobpostID. This job appears not to be published to the backend." });
    }

    // prevent duplicate
    const exists = await Application.findOne({ userAccount, jobpostID });
    if (exists)
      return res
        .status(409)
        .json({ success: false, message: "Application already exists" });

    const app = await Application.create({ userAccount, jobpostID, adminId });
    return res.status(201).json({ success: true, data: app });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
}

// List applications with user and job lookups, pagination and optional filters
async function getAllApplications(req, res) {
  try {
    const { page = 1, limit = 20, jobpostID, userAccount } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const lim = Math.max(1, parseInt(limit, 10) || 20);
    const skip = (pageNum - 1) * lim;

    const match = {};
    if (jobpostID && mongoose.Types.ObjectId.isValid(jobpostID))
      match.jobpostID = mongoose.Types.ObjectId(jobpostID);
    if (userAccount && mongoose.Types.ObjectId.isValid(userAccount))
      match.userAccount = mongoose.Types.ObjectId(userAccount);

    const pipeline = [
      { $match: match },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "useraccounts",
          localField: "userAccount",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "jobposts",
          localField: "jobpostID",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: { path: "$job", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          createdAt: 1,
          updatedAt: 1,
          adminId: 1,
          "user._id": 1,
          "user.fullName": 1,
          "user.email": 1,
          // alias commonly-named fields to simpler keys so frontend can read them consistently
          "user.github": "$user.githubProfile",
          "user.resume": "$user.resumeUrl",
          "user.skills": "$user.skills",
          "user.education": "$user.education",
          "user.developerType": "$user.developerType",
          "user.mobileNumber": 1,
          "job._id": 1,
          "job.title": 1,
          "job.skills": 1,
          "job.company": 1,
          "job.location": 1,
        },
      },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip }, { $limit: lim }],
        },
      },
    ];

    const agg = await Application.aggregate(pipeline);
    const metadata = (agg[0] && agg[0].metadata[0]) || { total: 0 };
    const data = (agg[0] && agg[0].data) || [];

    return res
      .status(200)
      .json({
        success: true,
        data,
        meta: { total: metadata.total, page: pageNum, limit: lim },
      });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
}

// Get single application with lookups
async function getApplicationById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid id" });

    const pipeline = [
      { $match: { _id: mongoose.Types.ObjectId(id) } },
      { $limit: 1 },
      {
        $lookup: {
          from: "useraccounts",
          localField: "userAccount",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "jobposts",
          localField: "jobpostID",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: { path: "$job", preserveNullAndEmptyArrays: true } },
      // Project explicit fields including user's github and resume so the API response contains them
      {
        $project: {
          _id: 1,
          createdAt: 1,
          updatedAt: 1,
          adminId: 1,
          "user._id": 1,
          "user.fullName": 1,
          "user.email": 1,
          "user.github": "$user.githubProfile",
          "user.resume": "$user.resumeUrl",
          "user.skills": "$user.skills",
          "user.education": "$user.education",
          "user.developerType": "$user.developerType",
          "user.mobileNumber": 1,
          "job._id": 1,
          "job.title": 1,
          "job.skills": 1,
          "job.company": 1,
          "job.location": 1,
        },
      },
    ];

    const [doc] = await Application.aggregate(pipeline);
    if (!doc)
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
}

// Delete application
async function deleteApplication(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, message: "Invalid id" });

    const deleted = await Application.findByIdAndDelete(id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    return res
      .status(200)
      .json({ success: true, message: "Application deleted" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
}

// Summary: count of applications per jobpost
async function getApplicationSummary(req, res) {
  try {
    const pipeline = [
      { $group: { _id: "$jobpostID", applications: { $sum: 1 } } },
      {
        $lookup: {
          from: "jobposts",
          localField: "_id",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: { path: "$job", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          jobId: "$_id",
          title: "$job.title",
          company: "$job.company",
          applications: 1,
        },
      },
      { $sort: { applications: -1 } },
    ];

    const summary = await Application.aggregate(pipeline);
    return res.status(200).json({ success: true, data: summary });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: err.message || "Server error" });
  }
}

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationById,
  deleteApplication,
  getApplicationSummary,
};
