const jwt = require("jsonwebtoken");

function auth(required = true) {
  return (req, res, next) => {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) {
      if (!required) return next();
      return res.status(401).json({ message: "Missing token" });
    }
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || "dev_secret");
      req.user = payload;
      next();
    } catch (_e) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}

module.exports = { auth, requireRole };


