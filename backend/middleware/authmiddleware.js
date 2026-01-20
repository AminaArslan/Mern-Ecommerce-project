import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired, please login again" });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token, please login again" });
    }

    return res.status(500).json({ message: "Authentication failed" });
  }
};



// admin email pasword
// {
//   "email": "admin@gmail.com",
//   "password": "Helloadmin@12",
//   "role": "admin"
// }