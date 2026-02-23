const jwt = require('jsonwebtoken');

module.exports = (roles = []) => (req, res, next) => {
  if (typeof roles === 'string') roles = [roles];
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ msg: 'No token' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    if (roles.length && !roles.includes(payload.role)) return res.status(403).json({ msg: 'Forbidden' });
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Invalid token' });
  }
};
