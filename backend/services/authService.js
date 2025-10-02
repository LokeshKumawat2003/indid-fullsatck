const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = require("../models/userSchema");

const generateToken = (id) => {
    return jwt.sign({ id }, "lokesh", { expiresIn: "5y" });
};

const authService = {
    signup: async (userData) => {
        try {
            const { name, email, password } = userData;

            if (!password) {
                throw new Error("Password is required for signup.");
            }

            const existingUser = await UserSchema.findOne({ email });
            if (existingUser) {
                throw new Error("User already exists");
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await UserSchema.create({
                name,
                email,
                password: hashedPassword,
            });

            if (!user) {
                throw new Error("User creation failed");
            }

            const { password: _, ...userWithoutPassword } = user.toObject();

            return {
                user: userWithoutPassword,
                token: generateToken(user._id),
            };
        } catch (error) {
            console.error("Signup error:", error);
            throw error;
        }
    },

    login: async (userData) => {
        const { email, password } = userData;

        const user = await UserSchema.findOne({ email });
        if (!user) {
            throw new Error("Invalid email or password");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error("Invalid email or password");
        }

        const { password: _, ...userWithoutPassword } = user.toObject();

        return {
            user: userWithoutPassword,
            token: generateToken(user._id),
        };
    },
};

module.exports = authService;
