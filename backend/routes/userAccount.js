const express = require("express")
const userAccountController = require("../controllers/userAccount.js");
const authMiddleware = require("../middlewares/auth.middleware.js"); // Import authMiddleware

const UserAccount = express.Router();

UserAccount.post("/", authMiddleware, userAccountController.createAccount); // Apply authMiddleware
UserAccount.get("/me", authMiddleware, userAccountController.getAccountById); // Specific route for /me
UserAccount.get("/:id", authMiddleware, userAccountController.getAccountById); // Apply middleware
UserAccount.put("/:id", authMiddleware, userAccountController.updateAccount); // Apply middleware
UserAccount.delete("/:id", authMiddleware, userAccountController.deleteAccount); // Apply middleware
UserAccount.get("/", authMiddleware, userAccountController.getAllAccounts); // Apply middleware

module.exports = UserAccount;
