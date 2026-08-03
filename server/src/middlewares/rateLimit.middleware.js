import { Errors } from '../utils/error/error.js';

// ─── DEV MODE (active) ──────────────────────────────────────────────
// In-memory bucket. Correct for single-instance dev and fine for a
// single-instance prod deploy too — the failure mode is specifically
// multiple processes/instances not sharing state, not "dev vs prod."
const buckets = new Map();

export function rateLimit({ windowMs, max, keyFn }) {
  return (req, res, next) => {
    const key = keyFn(req);
    const now = Date.now();
    const bucket = buckets.get(key) ?? { count: 0, resetAt: now + windowMs };

    if (now > bucket.resetAt) {
      bucket.count = 0;
      bucket.resetAt = now + windowMs;
    }

    bucket.count += 1;
    buckets.set(key, bucket);

    if (bucket.count > max) {
      return next(Errors.RATE_LIMITED());
    }
    next();
  };
}

// ─── MULTI-INSTANCE MODE (commented — uncomment when you scale past
// one process, e.g. pm2 cluster mode or horizontal pods) ────────────
//
// import { createClient } from 'redis';
// const redis = createClient({ url: process.env.REDIS_URL });
// await redis.connect();
//
// export function rateLimit({ windowMs, max, keyFn }) {
//   return async (req, res, next) => {
//     const key = `ratelimit:${keyFn(req)}`;
//     const count = await redis.incr(key);
//     if (count === 1) {
//       await redis.pExpire(key, windowMs);
//     }
//     if (count > max) {
//       return next(Errors.RATE_LIMITED());
//     }
//     next();
//   };
// }