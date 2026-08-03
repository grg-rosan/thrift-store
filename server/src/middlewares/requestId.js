import crypto from 'node:crypto';

export function requestId(req, res, next) {
  const incomingId = req.headers['x-request-id'];
  res.locals.requestId = incomingId || `req_${crypto.randomUUID()}`;
  res.setHeader('x-request-id', res.locals.requestId);
  next();
}