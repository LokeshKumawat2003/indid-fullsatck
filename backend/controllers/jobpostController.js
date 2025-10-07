const jobpostService = require("../services/jobpostService");

const createJobPost = async (req, res, next) => {
  try {
    const jobPostData = { ...req.body, userId: req.user.id };
    const jobPost = await jobpostService.createJobPost(jobPostData);
    res.status(201).json(jobPost);
  } catch (error) {
    next(error);
  }
};

const getJobPosts = async (req, res, next) => {
  try {
    let pipeline = [];
    let filters = { ...req.query, userId: req.user.id }; // Add userId to filters

    if (req.query.pipeline) {
      try {
        pipeline = JSON.parse(req.query.pipeline);
      } catch (error) {
        return res.status(400).json({ message: "Invalid pipeline format" });
      }
    } else {
      filters.userId = req.user.id; // Ensure userId is always applied when no pipeline
    }

    const jobPosts = await jobpostService.getJobPosts(pipeline, filters);
    res.status(200).json(jobPosts);
  } catch (error) {
    next(error);
  }
};

const getJobPostById = async (req, res, next) => {
  try {
    const jobPost = await jobpostService.getJobPostById(req.params.id);
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }
    res.status(200).json(jobPost);
  } catch (error) {
    next(error);
  }
};

const updateJobPost = async (req, res, next) => {
  try {
    const jobPost = await jobpostService.updateJobPost(req.params.id, req.body);
    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }
    res.status(200).json(jobPost);
  } catch (error) {
    next(error);
  }
};

const deleteJobPost = async (req, res, next) => {
  try {
    const message = await jobpostService.deleteJobPost(req.params.id);
    res.status(200).json(message);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJobPost,
  getJobPosts,
  getJobPostById,
  updateJobPost,
  deleteJobPost,
};
