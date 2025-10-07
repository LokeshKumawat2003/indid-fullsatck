const JobPost = require("../models/jobpost.Schema");

const createJobPost = async (jobPostData) => {
  const jobPost = new JobPost(jobPostData);
  await jobPost.save();
  return jobPost;
};

const getJobPosts = async (pipeline = [], filters = {}) => {
  try {
    if (pipeline.length > 0) {
      const jobPosts = await JobPost.aggregate(pipeline);
      return jobPosts;
    } else {
      const jobPosts = await JobPost.find(filters);
      return jobPosts;
    }
  } catch (error) {
    console.error("Error in getJobPosts service:", error);
    throw error; // Re-throw the error so it can be caught by the controller's try-catch
  }
};

const getJobPostById = async (id) => {
  const jobPost = await JobPost.findById(id);
  return jobPost;
};

const updateJobPost = async (id, jobPostData) => {
  const jobPost = await JobPost.findByIdAndUpdate(id, jobPostData, { new: true });
  return jobPost;
};

const deleteJobPost = async (id) => {
  await JobPost.findByIdAndDelete(id);
  return { message: "Job post deleted successfully" };
};

module.exports = {
  createJobPost,
  getJobPosts,
  getJobPostById,
  updateJobPost,
  deleteJobPost,
};



