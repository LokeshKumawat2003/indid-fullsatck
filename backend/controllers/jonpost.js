const express = require("express");
const jobpostService = require("../services/jobpostService");
const jobpost = express.Router();

const createJobPost = async (req, res, next) => {
  try {
    const { title, description, company, location } = req.body;
    const userId = req.user.id; // Assuming user ID is available in req.user.id after authentication
    const jobPost = await jobpostService.createJobPost({
      title,
      description,
      company,
      location,
      userId, // Add userId to the job post data
    });
    res.status(201).json(jobPost);
  } catch (error) {
    next(error);
  }
};

const getAllJobPosts = async (req, res, next) => {
  try {
    const jobPosts = await jobpostService.getAllJobPosts();
    res.status(200).json(jobPosts);
  } catch (error) {
    next(error);
  }
};

const getJobPostById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const jobPost = await jobpostService.getJobPostById(id);
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
    const { id } = req.params;
    const updates = req.body;
    const updatedJobPost = await jobpostService.updateJobPost(id, updates);
    if (!updatedJobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }
    res.status(200).json(updatedJobPost);
  } catch (error) {
    next(error);
  }
};

const deleteJobPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await jobpostService.deleteJobPost(id);
    if (!deleted) {
      return res.status(404).json({ message: "Job post not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJobPost,
  getAllJobPosts,
  getJobPostById,
  updateJobPost,
  deleteJobPost,
};
