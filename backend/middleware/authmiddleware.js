import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if user exists
      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
      }

      if (!user.isActive) {
        return res.status(403).json({ message: "Account is deactivated" });
      }

      req.user = user;
    }

    // If no token, don't throw error — this allows guest users to continue
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