const jwt = require("jsonwebtoken");

// Auth middleware supports either a session or a Bearer JWT.
module.exports = (req, res, next) => {
  // 1) Session-based auth (server-side session cookie)
  if (req.session && req.session.user) {
    req.user = req.session.user; // { id, role }
    return next();
  }

  // 2) Bearer token (legacy / API clients)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};