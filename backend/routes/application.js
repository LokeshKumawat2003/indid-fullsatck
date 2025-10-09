const express = require("express");

const authMiddleware = require("../middlewares/auth.middleware.js");
const {
  createApplication,
  getAllApplications,
  getApplicationById,
  deleteApplication,
  getApplicationSummary,
} = require("../controllers/appliaction.js");

const Application = express.Router();

// Create a new application (authenticated)
Application.post("/create", authMiddleware, createApplication);

// List applications with optional filters and pagination (authenticated)
Application.get("/", authMiddleware, getAllApplications);

// Summary (count per job) (authenticated)
Application.get("/summary", authMiddleware, getApplicationSummary);

// Get single application (public)
Application.get("/:id", getApplicationById);

// Delete application (authenticated)
Application.delete("/:id", authMiddleware, deleteApplication);

module.exports = Application;

