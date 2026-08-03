import { verifyToken } from '../utils/auth/jwt.js';
import { Errors } from '../utils/error/error.js';

export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return next(Errors.UNAUTHORIZED());

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return next(Errors.TOKEN_EXPIRED());
    return next(Errors.UNAUTHORIZED());
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return next(Errors.UNAUTHORIZED());
    if (!allowedRoles.includes(req.user.role)) return next(Errors.FORBIDDEN());
    next();
  };
}