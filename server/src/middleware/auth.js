const jwt = require('jsonwebtoken');
const config = require('../config');

function authMiddleware(required = true) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        if (required) {
          return res.status(401).json({ code: 401, message: '未提供认证令牌', data: null });
        }
        req.user = null;
        return next();
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, config.jwt.secret);
      req.user = { id: decoded.id, role: decoded.role, type: decoded.type };
      next();
    } catch (err) {
      if (required) {
        return res.status(401).json({ code: 401, message: '认证令牌无效或已过期', data: null });
      }
      req.user = null;
      next();
    }
  };
}

function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ code: 403, message: '无权限访问', data: null });
  }
  next();
}

module.exports = { authMiddleware, adminMiddleware };
