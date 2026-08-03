export class AppError extends Error {
  constructor(code, message, statusCode, details = null) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, AppError);
  }
}

export const Errors = {
  INVALID_OTP: () => new AppError('INVALID_OTP', 'The verification code is invalid or expired.', 401),
  UNAUTHORIZED: () => new AppError('UNAUTHORIZED', 'Authentication is required for this action.', 401),
  FORBIDDEN: () => new AppError('FORBIDDEN', 'You do not have permission to perform this action.', 403),
  TOKEN_EXPIRED: () => new AppError('TOKEN_EXPIRED', 'Session expired, please log in again.', 401),
  REFRESH_TOKEN_REUSE_DETECTED: () => new AppError('REFRESH_TOKEN_REUSE_DETECTED', 'Refresh token reuse detected. All sessions revoked.', 401),
  VALIDATION_FAILED: (details) => new AppError('VALIDATION_FAILED', 'One or more fields are invalid.', 422, details),
  LISTING_ALREADY_RESERVED: (details) => new AppError('LISTING_ALREADY_RESERVED', 'This listing was reserved by another user.', 409, details),
  LISTING_NOT_FOUND: () => new AppError('LISTING_NOT_FOUND', 'Listing not found.', 404),
  NOT_FOUND: (resource = 'Resource') => new AppError('NOT_FOUND', `${resource} not found.`, 404),
  RATE_LIMITED: () => new AppError('RATE_LIMITED', 'Too many requests. Please try again later.', 429),
  INTERNAL_ERROR: () => new AppError('INTERNAL_ERROR', 'Something went wrong.', 500),
};