const express = require("express");
const { createJobPost, getJobPosts, getJobPostById, updateJobPost, deleteJobPost } = require("../controllers/jobpostController");
const authMiddleware = require("../middlewares/auth.middleware");

const Jobpost = express.Router();

Jobpost.post("/createJobPost", authMiddleware, createJobPost);
Jobpost.get("/getAllJobPosts", authMiddleware, getJobPosts);
Jobpost.get("/:id", getJobPostById);
Jobpost.put("/:id", updateJobPost);
Jobpost.delete("/:id", deleteJobPost);

module.exports = Jobpost;
