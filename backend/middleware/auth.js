const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'TCM_ARTS_SUPER_SECRET_KEY';

// Middleware to authenticate any logged in user
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No session token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Session expired or invalid token.' });
  }
};

// Middleware to restrict access to Admins/Owners only
const requireAdmin = (req, res, next) => {
  authenticateToken(req, res, () => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
    }
    next();
  });
};

module.exports = {
  authenticateToken,
  requireAdmin,
  JWT_SECRET
};
