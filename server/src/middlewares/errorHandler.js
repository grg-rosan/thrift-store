import { AppError } from '../utils/error/error.js';

export function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: { code: err.code, message: err.message, details: err.details },
      requestId: res.locals.requestId,
    });
  }

  console.error(`[${res.locals.requestId}]`, err);
  return res.status(500).json({
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong.', details: null },
    requestId: res.locals.requestId,
  });
}