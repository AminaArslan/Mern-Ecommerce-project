  // Check if user is admin
  export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Access denied: Admins only" });
    }
  };

  // Generic role check
  export const hasRole = (roles) => (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ message: "Access denied: insufficient role" });
    }
  };
