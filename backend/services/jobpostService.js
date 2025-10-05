const JobPost = require("../models/jobpost.Schema");

const createJobPost = async (jobPostData) => {
  const newJobPost = await JobPost.create(jobPostData);
  return newJobPost;
};

const getAllJobPosts = async () => {
  const jobPosts = await JobPost.find();
  return jobPosts;
};

const getJobPostById = async (id) => {
  const jobPost = await JobPost.findById(id);
  return jobPost;
};

const updateJobPost = async (id, updates) => {
  const updatedJobPost = await JobPost.findByIdAndUpdate(id, updates, {
    new: true,
  });
  return updatedJobPost;
};

const deleteJobPost = async (id) => {
  const deletedJobPost = await JobPost.findByIdAndDelete(id);
  return deletedJobPost;
};

module.exports = {
  createJobPost,
  getAllJobPosts,
  getJobPostById,
  updateJobPost,
  deleteJobPost,
};



