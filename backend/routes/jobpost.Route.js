const express = require("express");
const { createJobPost, getAllJobPosts, getJobPostById, updateJobPost, deleteJobPost } = require("../controllers/jonpost");

const Jobpost = express.Router();

Jobpost.post("/", createJobPost);
Jobpost.get("/", getAllJobPosts);
Jobpost.get("/:id", getJobPostById);
Jobpost.put("/:id", updateJobPost);
Jobpost.delete("/:id", deleteJobPost);

module.exports = Jobpost;
