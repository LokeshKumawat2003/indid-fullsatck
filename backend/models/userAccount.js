const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email Address is required"],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
        },
        mobileNumber: {
            type: String,
            required: [true, "Mobile Number is required"],
            match: [/^\+91\s?\d{5}\s?\d{5}$/, "Please enter a valid Indian mobile number"],
        },
        developerType: {
            type: String,
            required: [true, "Developer Type is required"],
            enum: [
                "Frontend Developer",
                "Backend Developer",
                "Full Stack Developer",
                "Mobile App Developer",
                "DevOps Engineer",
                "Data Scientist",
                "Other",
            ],
        },
        education: {
            type: String,
            required: [true, "Education details are required"],
            trim: true,
        },
        githubProfile: {
            type: String,
            trim: true,
            match: [/^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_-]+$/, "Invalid GitHub URL"],
        },
        resumeUrl: {
            type: String,
            required: [true, "Resume URL is required"],
         
        },
        skills: {
            type: [String],
            required: [true, "At least one skill is required"],
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("UserAccount", userSchema);
