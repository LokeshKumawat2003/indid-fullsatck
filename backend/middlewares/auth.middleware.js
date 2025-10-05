
const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];
    try {
    
        const decoded = jwt.verify(token, "lokesh");
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(401).json({ message: "Invalid or expired token." });
    }
};

module.exports = authMiddleware;

