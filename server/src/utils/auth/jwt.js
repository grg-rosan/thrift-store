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