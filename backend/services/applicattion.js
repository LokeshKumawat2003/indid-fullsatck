const ApplicationModel = require("../models/applications");

// Create a new application
const createApplication = async (applicationData) => {
  try {
    const application = new ApplicationModel(applicationData);
    await application.save();
    return application;
  } catch (error) {
    console.error("Error creating application:", error);
    throw error;
  }
};

// Get all applications
const getAllApplications = async () => {
  try {
    const applications = await ApplicationModel.find()
      .populate("userAccount")
      .populate("jobpostID")
      .populate("adminId");
    return applications;
  } catch (error) {
    console.error("Error fetching all applications:", error);
    throw error;
  }
};

// Get application by ID
const getApplicationById = async (id) => {
  try {
    const application = await ApplicationModel.findById(id)
      .populate("userAccount")
      .populate("jobpostID")
      .populate("adminId");
    return application;
  } catch (error) {
    console.error("Error fetching application:", error);
    throw error;
  }
};

// Delete application by ID
const deleteApplicationById = async (id) => {
  try {
    const deletedApp = await ApplicationModel.findByIdAndDelete(id);
    return deletedApp;
  } catch (error) {
    console.error("Error deleting application:", error);
    throw error;
  }
};

module.exports = {
  createApplication,
  getAllApplications,
  getApplicationById,
  deleteApplicationById,
};
