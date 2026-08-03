

## Consolidated file listing

**`config/db.config.js`** (or `lib/prisma.js` per your actual tree)
```js
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
```

**`utils/error/error.js`**
```js
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
```

**`utils/error/response.js`**
```js
export function sendSuccess(res, { data, meta = null, nextCursor = null, statusCode = 200 }) {
  return res.status(statusCode).json({ data, meta, nextCursor, requestId: res.locals.requestId });
}

export function sendPaginated(res, { data, count, hasMore, nextCursor }) {
  return sendSuccess(res, { data, meta: { count, hasMore }, nextCursor });
}
```

**`utils/auth/jwt.js`**
```js
import jwt from 'jsonwebtoken';
import { readFileSync } from 'node:fs';

const PRIVATE_KEY = readFileSync(process.env.JWT_PRIVATE_KEY_PATH, 'utf8');
const PUBLIC_KEY = readFileSync(process.env.JWT_PUBLIC_KEY_PATH, 'utf8');

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '30d';

export function signAccessToken(payload) {
  return jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: ACCESS_TOKEN_TTL });
}

export function signRefreshToken(payload) {
  return jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: REFRESH_TOKEN_TTL });
}

export function verifyToken(token) {
  return jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] });
}

export function decodeTokenUnsafe(token) {
  return jwt.decode(token);
}
```

**`utils/auth/otp.js`**
```js
import crypto from 'node:crypto';

const OTP_LENGTH = 6;
const OTP_TTL_MS = 5 * 60 * 1000;

export function generateOtp() {
  const otp = crypto.randomInt(0, 10 ** OTP_LENGTH).toString().padStart(OTP_LENGTH, '0');
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);
  return { otp, expiresAt };
}

export function hashOtp(otp) {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

export function verifyOtpHash(otp, hash) {
  const candidate = hashOtp(otp);
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(hash));
}

export function isOtpExpired(expiresAt) {
  return new Date() > new Date(expiresAt);
}
```

**`middleware/requestId.js`**
```js
import crypto from 'node:crypto';

export function requestId(req, res, next) {
  const incomingId = req.headers['x-request-id'];
  res.locals.requestId = incomingId || `req_${crypto.randomUUID()}`;
  res.setHeader('x-request-id', res.locals.requestId);
  next();
}
```

**`middleware/validate.js`**
```js
import { Errors } from '../utils/error/error.js';

export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        issue: issue.message,
      }));
      return next(Errors.VALIDATION_FAILED(details));
    }
    req[source] = result.data;
    next();
  };
}
```

**`middleware/auth.middleware.js`**
```js
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
```

**`middleware/errorHandler.js`**
```js
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
```

**`app.js`** (final merged version)
```js
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import { requestId } from './middleware/requestId.js';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import listingRoutes from './routes/listing.routes.js';
import chatRoutes from './routes/chat.routes.js';
import reviewRoutes from './routes/review.routes.js';
import communityRoutes from './routes/community.routes.js';

import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { prisma } from './lib/prisma.js';

const app = express();

app.use(requestId);
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.sendStatus(200);
  } catch (err) {
    console.error(`[${res.locals.requestId}] health check failed`, err);
    res.sendStatus(503);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/community', communityRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
```