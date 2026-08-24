// Role-based access control middleware

exports.adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

exports.trainerOrAdmin = (req, res, next) => {
  if (
    !req.user ||
    (req.user.role !== "trainer" && req.user.role !== "admin")
  ) {
    return res.status(403).json({ message: "Trainer or admin access only" });
  }
  next();
};